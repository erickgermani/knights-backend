import { Module } from '@nestjs/common';
import { KnightsController } from './knights.controller';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import KnightPrismaRepository from './database/prisma/repositories/knight-prisma.repository';
import { CreateKnightUseCase } from '../application/usecases/create-knight.usecase';
import KnightRepository from '../domain/repositories/knight.repository';
import { GetKnightUseCase } from '../application/usecases/get-knight.usecase';
import { ListKnightsUseCase } from '../application/usecases/list-knights.usecase';

@Module({
  controllers: [KnightsController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'KnightRepository',
      useFactory: (prismaService: PrismaService) => {
        return new KnightPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateKnightUseCase.UseCase,
      useFactory: (knightRepository: KnightRepository.Repository) => {
        return new CreateKnightUseCase.UseCase(knightRepository);
      },
      inject: ['KnightRepository'],
    },
    {
      provide: GetKnightUseCase.UseCase,
      useFactory: (knightRepository: KnightRepository.Repository) => {
        return new GetKnightUseCase.UseCase(knightRepository);
      },
      inject: ['KnightRepository'],
    },
    {
      provide: ListKnightsUseCase.UseCase,
      useFactory: (knightRepository: KnightRepository.Repository) => {
        return new ListKnightsUseCase.UseCase(knightRepository);
      },
      inject: ['KnightRepository'],
    },
  ],
})
export class KnightsModule {}
