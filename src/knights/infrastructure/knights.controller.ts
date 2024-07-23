import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateKnightUseCase } from '../application/usecases/create-knight.usecase';
import { KnightOutput } from '../application/dtos/knight-output';
import KnightPresenter, {
  KnightCollectionPresenter,
} from './presenters/knight.presenter';
import { ListKnightsUseCase } from '../application/usecases/list-knights.usecase';
import { CreateDto } from './dtos/create.dto';

@Controller('knights')
export class KnightsController {
  @Inject(CreateKnightUseCase.UseCase)
  private createKnightUseCase: CreateKnightUseCase.UseCase;

  static knightToResponse(output: KnightOutput) {
    return new KnightPresenter(output);
  }

  static listKnightsToResponse(output: ListKnightsUseCase.Output) {
    return new KnightCollectionPresenter(output);
  }

  @Post()
  async create(@Body() createDto: CreateDto) {
    const output = await this.createKnightUseCase.execute(createDto);
    return KnightsController.knightToResponse(output);
  }
}
