import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateKnightUseCase } from '../application/usecases/create-knight.usecase';
import { KnightOutput } from '../application/dtos/knight-output';
import KnightPresenter, {
  KnightCollectionPresenter,
} from './presenters/knight.presenter';
import { ListKnightsUseCase } from '../application/usecases/list-knights.usecase';
import { CreateDto } from './dtos/create.dto';
import { GetKnightUseCase } from '../application/usecases/get-knight.usecase';
import { ListKnightsDto } from './dtos/list-knights.dto';

@Controller('knights')
export class KnightsController {
  @Inject(CreateKnightUseCase.UseCase)
  private createKnightUseCase: CreateKnightUseCase.UseCase;

  @Inject(GetKnightUseCase.UseCase)
  private getKnightUseCase: GetKnightUseCase.UseCase;

  @Inject(ListKnightsUseCase.UseCase)
  private listKnightsUseCase: ListKnightsUseCase.UseCase;

  static knightToResponse(output: KnightOutput) {
    return new KnightPresenter(output);
  }

  static listKnightsToResponse(output: ListKnightsUseCase.Output) {
    return new KnightCollectionPresenter(output);
  }

  @Get()
  async list(@Query() searchParams: ListKnightsDto) {
    const output = await this.listKnightsUseCase.execute(searchParams);
    return KnightsController.listKnightsToResponse(output);
  }

  @Post()
  async create(@Body() createDto: CreateDto) {
    const output = await this.createKnightUseCase.execute(createDto);
    return KnightsController.knightToResponse(output);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const output = await this.getKnightUseCase.execute({ id });
    return KnightsController.knightToResponse(output);
  }
}
