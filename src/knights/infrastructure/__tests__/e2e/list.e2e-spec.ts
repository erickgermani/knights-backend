import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
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
  let entity: KnightEntity;
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
    await prismaService.knight.deleteMany();

    entity = new KnightEntity(KnightDataBuilder());

    await repository.insert(entity);
  });

  describe('GET /knights', () => {
    it('should return the knights ordered by createdAt', async () => {
      const createdAt = new Date();
      const entities: KnightEntity[] = [];

      const arrange = Array(3).fill(KnightDataBuilder());

      arrange.forEach((element, index) => {
        entities.push(
          new KnightEntity({
            ...element,
            nickname: `nickname #${index}`,
            createdAt: new Date(createdAt.getTime() + index * 1000),
          }),
        );
      });

      await prismaService.knight.deleteMany();
      await prismaService.knight.createMany({
        data: entities.map((entity) => entity.toJSON()),
      });

      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams).toString();

      const res = await request(app.getHttpServer())
        .get(`/v1/knights/?${queryParams}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map((entity) =>
            instanceToPlain(KnightsController.knightToResponse(entity)),
          ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 15,
          lastPage: 1,
        },
      });
    });

    it('should return the knights ordered by name', async () => {
      const entities: KnightEntity[] = [];
      const arrange = ['test1', 'a', 'test3', 'b', 'test2'];

      arrange.forEach((element, index) => {
        entities.push(
          new KnightEntity({
            ...KnightDataBuilder(),
            name: element,
            nickname: `nickname #${index}`,
          }),
        );
      });

      await prismaService.knight.createMany({
        data: entities.map((entity) => entity.toJSON()),
      });

      let searchParams = {
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filterBy: 'TEST',
      };

      let queryParams = new URLSearchParams(searchParams as any).toString();

      let res = await request(app.getHttpServer())
        .get(`/v1/knights/?${queryParams}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[0].toJSON(), entities[4].toJSON()].map((entity) =>
          instanceToPlain(KnightsController.knightToResponse(entity)),
        ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
        },
      });

      searchParams = {
        page: 2,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filterBy: 'TEST',
      };

      queryParams = new URLSearchParams(searchParams as any).toString();

      res = await request(app.getHttpServer())
        .get(`/v1/knights/?${queryParams}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[2].toJSON()].map((entity) =>
          instanceToPlain(KnightsController.knightToResponse(entity)),
        ),
        meta: {
          total: 3,
          currentPage: 2,
          perPage: 2,
          lastPage: 2,
        },
      });
    });
  });

  it('should return an error with 422 code when the query params is invalid', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/knights/?fakeId=10')
      .expect(422);

    expect(res.body.error).toBe('Unprocessable Entity');
    expect(res.body.message).toEqual(['property fakeId should not exist']);
  });
});
