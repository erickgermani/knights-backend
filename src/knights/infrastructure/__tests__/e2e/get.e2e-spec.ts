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
import {
  KnightEntity,
  KnightEntityFactory,
} from '@/knights/domain/entities/knight.entity';
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
  }, 15000);

  beforeEach(async () => {
    await prismaService.knight.deleteMany();

    entity = KnightEntityFactory.create(KnightDataBuilder());

    await repository.insert(entity);
  });

  describe('GET /knights/:id', () => {
    it('Should get an knight', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/knights/' + entity.id)
        .expect(200);

      const presenter = KnightsController.knightToResponse(entity.toJSON());

      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toMatchObject(serialized);
    });

    it('Should return an error with 404 code when the throw NotFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .get('/v1/knights/fakeId')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'KnightModel not found using ID fakeId',
        });
    });
  });
});
