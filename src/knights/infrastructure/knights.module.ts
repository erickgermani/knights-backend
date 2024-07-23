import { Module } from '@nestjs/common';
import { KnightsController } from './knights.controller';

@Module({
  controllers: [KnightsController],
})
export class KnightsModule {}
