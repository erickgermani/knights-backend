import { Module } from '@nestjs/common';
import { KnightsModule } from './knights/infrastructure/knights.module';

@Module({
  imports: [KnightsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
