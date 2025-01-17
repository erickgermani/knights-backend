import { PrismaClient } from '@prisma/client';
import KnightPrismaRepository from '../../knight-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import {
  KnightEntity,
  KnightEntityFactory,
} from '@/knights/domain/entities/knight.entity';
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
  }, 15000);

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
    const entity = KnightEntityFactory.create(KnightDataBuilder());

    const newKnight = await prismaService.knight.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newKnight.id);

    expect(output.id).toEqual(entity.id);
    expect(output.name).toEqual(entity.name);
    expect(output.nickname).toEqual(entity.nickname);
    expect(output.birthday).toEqual(entity.birthday);
    expect(output.keyAttribute).toEqual(entity.keyAttribute);
  });

  it('Should inserts a new entity', async () => {
    const entity = KnightEntityFactory.create(KnightDataBuilder());

    await sut.insert(entity);

    const result = await prismaService.knight.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(result).toStrictEqual(entity.toJSON());
  });

  it('Should returns all knights', async () => {
    const entity = KnightEntityFactory.create(KnightDataBuilder());

    await prismaService.knight.create({
      data: entity.toJSON(),
    });

    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);

    entities.map((item) =>
      expect(item.toJSON()).toStrictEqual(entity.toJSON()),
    );
  });

  describe('Search method tests', () => {
    it('Should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = Array(16).fill(KnightDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          KnightEntityFactory.create({
            ...element,
            name: `Knight #${index}`,
            nickname: `Knight #${index}`,
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

    it('Should search using filter, sort and paginate', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = ['test1', 'a', 'test3', 'b', 'test2'];

      arrange.forEach((element, index) => {
        entities.push(
          KnightEntityFactory.create({
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
          filterBy: 'test',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toStrictEqual(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toStrictEqual(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new KnightRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filterBy: 'test',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toStrictEqual(
        entities[2].toJSON(),
      );
    });
  });

  it('Should throws error on update when entity not found', async () => {
    const entity = KnightEntityFactory.create(KnightDataBuilder());

    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`KnightModel not found using ID ${entity._id}`),
    );
  });

  it('Should update a entity nickname', async () => {
    const entity = KnightEntityFactory.create(KnightDataBuilder());

    await prismaService.knight.create({
      data: entity.toJSON(),
    });

    entity.updateNickname('new nickname');

    await sut.update(entity);

    const output = await prismaService.knight.findUnique({
      where: {
        id: entity._id,
      },
    });

    if (!output) throw new Error('Updated entity not found');

    expect(output.id).toEqual(entity.id);
    expect(output.nickname).toEqual('new nickname');
    expect(output.updatedAt).toBeInstanceOf(Date);
  });

  it('Should throws error when try delete an entity', async () => {
    await expect(() => sut.delete('FakeId')).rejects.toThrow(
      new Error('Method not implemented'),
    );
  });

  it('Should throws error when entity found by nickname', async () => {
    const entity = KnightEntityFactory.create(
      KnightDataBuilder({ nickname: 'test nickname' }),
    );
    await prismaService.knight.create({
      data: entity.toJSON(),
    });

    await expect(() => sut.nicknameExists('test nickname')).rejects.toThrow(
      new ConflictError(`Nickname already used`),
    );
  });

  it('Should throws error when entity found by nickname', async () => {
    const entity = KnightEntityFactory.create(
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
