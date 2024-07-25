import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateDto } from '../../dtos/create.dto';
import { PrismaClient } from '@prisma/client';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { KnightsModule } from '../../knights.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import request from 'supertest';
import { KnightsController } from '../../knights.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '@/global-config';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';

describe('KnightsController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: KnightRepository.Repository;
  let createDto: CreateDto;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();

    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        KnightsModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<KnightRepository.Repository>('KnightRepository');
  }, 10000);

  beforeEach(async () => {
    createDto = {
      name: 'John Doe',
      nickname: 'john.knight',
      birthday: new Date(),
      weapons: [
        {
          attr: 'charisma',
          name: 'Ergonomic Fresh Pants',
          mod: 3,
          equipped: true,
        },
      ],
      attributes: {
        charisma: 17,
        constitution: 17,
        dexterity: 19,
        intelligence: 14,
        strength: 18,
        wisdom: 19,
      },
      keyAttribute: 'constitution',
    };

    await prismaService.knight.deleteMany();
  });

  describe('POST /knights', () => {
    it('Should create a knight', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/knights')
        .send(createDto)
        .expect(201);

      expect(Object.keys(res.body)).toStrictEqual(['data']);

      const knight = await repository.findById(res.body.data.id);

      const presenter = KnightsController.knightToResponse(knight.toJSON());

      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toMatchObject(serialized);
    });

    it('Should return an error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/knights')
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
        'nickname should not be empty',
        'nickname must be a string',
        'birthday must be a Date instance',
        'weapons should not be empty',
        'weapons must be an array',
        'attributes must be a non-empty object',
        'attributes must be an object',
        'keyAttribute should not be empty',
        'keyAttribute must be a string',
        'keyAttribute must be shorter than or equal to 12 characters',
      ]);
    });

    it('Should return an error with 422 code when the name field is invalid', async () => {
      delete createDto.name;

      const res = await request(app.getHttpServer())
        .post('/v1/knights')
        .send(createDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('Should return an error with 422 code when the birthday field is invalid', async () => {
      delete createDto.birthday;

      const res = await request(app.getHttpServer())
        .post('/v1/knights')
        .send(createDto)
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['birthday must be a Date instance']);
    });

    it('Should return an error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/knights')
        .send({ ...createDto, invalidField: 'invalid' })
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'property invalidField should not exist',
      ]);
    });

    it('Should return an error with 409 code when nickname is duplicated', async () => {
      const entity = new KnightEntity(KnightDataBuilder({ ...createDto }));

      await repository.insert(entity);

      await request(app.getHttpServer())
        .post('/v1/knights')
        .send(createDto)
        .expect(409)
        .expect({
          statusCode: 409,
          error: 'Conflict',
          message: 'Nickname already used',
        });
    });
  });
});
