import { PrismaClient } from '@prisma/client';
import KnightPrismaRepository from '../../knight-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('KnightPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();

  let sut: KnightPrismaRepository;

  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  }, 10000);

  beforeEach(async () => {
    sut = new KnightPrismaRepository(prismaService as any);

    await prismaService.knight.deleteMany();
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('KnightModel not found using ID FakeId'),
    );
  });

  it('Should finds an entity by id', async () => {
    const entity = new KnightEntity(KnightDataBuilder());

    const newKnight = await prismaService.knight.create({
      data: {
        id: entity.id,
        name: entity.name,
        nickname: entity.nickname,
        weapons: entity.weapons,
        attributes: entity.attributes,
        birthday: entity.birthday.toISOString(),
        keyAttribute: entity.keyAttribute,
        createdAt: entity.createdAt,
      },
    });

    const output = await sut.findById(newKnight.id);

    expect(output.id).toEqual(entity.id);
    expect(output.name).toEqual(entity.name);
    expect(output.nickname).toEqual(entity.nickname);
    expect(output.birthday).toEqual(entity.birthday);
    expect(output.keyAttribute).toEqual(entity.keyAttribute);
  });

  it('Should inserts a new entity', async () => {
    const entity = new KnightEntity(KnightDataBuilder());

    await sut.insert(entity);

    const result = await prismaService.knight.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(result).toMatchObject({
      id: entity.id,
      name: entity.name,
      nickname: entity.nickname,
      birthday: entity.birthday,
      weapons: entity.weapons,
      attributes: entity.attributes,
      keyAttribute: entity.keyAttribute,
      createdAt: entity.createdAt,
    });
  });

  it('Should returns all knights', async () => {
    const entity = new KnightEntity(KnightDataBuilder());

    await prismaService.knight.create({
      data: {
        id: entity.id,
        name: entity.name,
        nickname: entity.nickname,
        weapons: entity.weapons,
        attributes: entity.attributes,
        birthday: entity.birthday.toISOString(),
        keyAttribute: entity.keyAttribute,
        createdAt: entity.createdAt,
      },
    });

    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);

    entities.map((item) =>
      expect(item.toJSON()).toStrictEqual(entity.toJSON()),
    );
  });

  // TODO corrigir esse describe
  describe.skip('Search method tests', () => {
    it('Should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = Array(16).fill(KnightDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new KnightEntity({
            ...element,
            name: `Knight #${index}`,
            createdAt: new Date(createdAt.getTime() + index * 1000),
          }),
        );
      });

      await prismaService.knight.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput = await sut.search(
        new KnightRepository.SearchParams(),
      );

      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(KnightRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(KnightEntity);
      });

      expect(searchOutput.currentPage).toBe(1);

      items.reverse().forEach((item, index) => {
        expect(`Knight #${index + 1}`).toBe(item.name);
      });
    });

    it.skip('Should search using filter, sort and paginate', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];

      arrange.forEach((element, index) => {
        entities.push(
          new KnightEntity({
            ...KnightDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index * 1000),
          }),
        );
      });

      await prismaService.knight.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new KnightRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'test',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new KnightRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'test',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });

  it('Should throws error on update when entity not found', async () => {
    const entity = new KnightEntity(KnightDataBuilder());

    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`KnightModel not found using ID ${entity._id}`),
    );
  });

  it('Should update a entity', async () => {
    const entity = new KnightEntity(KnightDataBuilder());
    await prismaService.knight.create({
      data: {
        id: entity.id,
        name: entity.name,
        nickname: entity.nickname,
        weapons: entity.weapons,
        attributes: entity.attributes,
        birthday: entity.birthday.toISOString(),
        keyAttribute: entity.keyAttribute,
        createdAt: entity.createdAt,
      },
    });

    entity.updateNickname('new nickname');

    await sut.update(entity);

    const output = await prismaService.knight.findUnique({
      where: {
        id: entity._id,
      },
    });

    if (!output) throw new Error('Updated entity not found');

    expect(output.nickname).toBe('new nickname');
  });

  it('Should throws error on delete when entity not found', async () => {
    const entity = new KnightEntity(KnightDataBuilder());

    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`KnightModel not found using ID ${entity._id}`),
    );
  });

  // TODO refatorar esse teste
  it.skip('Should delete an entity', async () => {
    const entity = new KnightEntity(KnightDataBuilder());
    await prismaService.knight.create({
      data: entity.toJSON(),
    });

    await sut.delete(entity._id);

    const output = await prismaService.knight.findUnique({
      where: {
        id: entity._id,
      },
    });

    expect(output).toBeNull();
  });

  it('Should throws error when entity found by nickname', async () => {
    const entity = new KnightEntity(
      KnightDataBuilder({ nickname: 'test nickname' }),
    );
    await prismaService.knight.create({
      data: {
        id: entity.id,
        name: entity.name,
        nickname: entity.nickname,
        weapons: entity.weapons,
        attributes: entity.attributes,
        birthday: entity.birthday.toISOString(),
        keyAttribute: entity.keyAttribute,
        createdAt: entity.createdAt,
      },
    });

    await expect(() => sut.nicknameExists('test nickname')).rejects.toThrow(
      new ConflictError(`Nickname already used`),
    );
  });

  it('Should not finds a entity by fake nickname', async () => {
    expect.assertions(0);
    await sut.nicknameExists('test nickname');
  });
});
