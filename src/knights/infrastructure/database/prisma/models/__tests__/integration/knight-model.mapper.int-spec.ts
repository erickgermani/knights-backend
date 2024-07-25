import { PrismaClient, Knight } from '@prisma/client';
import KnightModelMapper from '../../knight-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';

describe('KnightModelMapper integration tests', () => {
  let prismaService: PrismaClient;

  let props: any;

  beforeAll(async () => {
    setupPrismaTests();

    prismaService = new PrismaClient();

    await prismaService.$connect();
  }, 10000);

  beforeEach(async () => {
    await prismaService.knight.deleteMany();

    props = {
      id: '60b8d2954f1a2b001f8d1a2b',
      name: 'Test name',
      nickname: 'Test nickname',
      birthday: new Date(),
      weapons: [
        {
          attr: 'charisma',
          equipped: true,
          mod: 0,
          name: 'name',
        },
      ],
      attributes: {
        strength: 15,
        dexterity: 10,
        constitution: 12,
        intelligence: 8,
        wisdom: 14,
        charisma: 13,
      },
      keyAttribute: 'constitution',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('Should throws error when knight model is invalid', async () => {
    const model: Knight = Object.assign(props, { name: null });

    expect(() => KnightModelMapper.toEntity(model)).toThrowError(
      ValidationError,
    );
  });

  it('Should convert a knight modal to a knight entity', async () => {
    const model: Knight = await prismaService.knight.create({
      data: props,
    });

    const sut = KnightModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(KnightEntity);
    expect(sut.toJSON()).toMatchObject(props);
  });
});
