import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
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
import { UpdateKnightDto } from './dtos/update-knight.dto';
import UpdateKnightUseCase from '../application/usecases/update-knight.usecase';
import { HeroifyKnightUseCase } from '../application/usecases/heroify-knight.usecase';

@Controller('knights')
export class KnightsController {
  @Inject(CreateKnightUseCase.UseCase)
  private createKnightUseCase: CreateKnightUseCase.UseCase;

  @Inject(GetKnightUseCase.UseCase)
  private getKnightUseCase: GetKnightUseCase.UseCase;

  @Inject(ListKnightsUseCase.UseCase)
  private listKnightsUseCase: ListKnightsUseCase.UseCase;

  @Inject(UpdateKnightUseCase.UseCase)
  private updateKnightUseCase: UpdateKnightUseCase.UseCase;

  @Inject(HeroifyKnightUseCase.UseCase)
  private heroifyKnightUseCase: HeroifyKnightUseCase.UseCase;

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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateKnightDto: UpdateKnightDto,
  ) {
    const output = await this.updateKnightUseCase.execute({
      id,
      ...updateKnightDto,
    });
    return KnightsController.knightToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async heroify(@Param('id') id: string) {
    await this.heroifyKnightUseCase.execute({ id });
  }
}
