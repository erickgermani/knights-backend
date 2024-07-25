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
import { UpdateKnightDto } from '../../dtos/update-knight.dto';

describe('KnightsController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: KnightRepository.Repository;
  let updateKnightDto: UpdateKnightDto;
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
    updateKnightDto = {
      nickname: 'test nickname',
    };

    await prismaService.knight.deleteMany();

    entity = new KnightEntity(KnightDataBuilder());

    await repository.insert(entity);
  });

  describe('PUT /knights', () => {
    // TODO corrigir este teste
    it.skip('should update an knight', async () => {
      updateKnightDto.nickname = 'updated nickname';

      const res = await request(app.getHttpServer())
        .put('/v1/knights/' + entity.id)
        .send(updateKnightDto)
        .expect(200);

      const knight = await repository.findById(entity._id);

      const presenter = KnightsController.knightToResponse(knight.toJSON());

      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return an error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put('/v1/knights/' + entity.id)
        .send({})
        .expect(422);

      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'nickname should not be empty',
        'nickname must be a string',
      ]);
    });

    it('should return an error with 404 code when the throw NotFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .put('/v1/knights/fakeId')
        .send(updateKnightDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'KnightModel not found using ID fakeId',
        });
    });
  });
});
