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
import { ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiTags('v1/knights')
@Controller('v1/knights')
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

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            currentPage: { type: 'number' },
            lastPage: { type: 'number' },
            perPage: { type: 'number' },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(KnightPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Invalid query params',
  })
  @Get()
  async list(@Query() searchParams: ListKnightsDto) {
    const output = await this.listKnightsUseCase.execute(searchParams);
    return KnightsController.listKnightsToResponse(output);
  }

  @ApiResponse({
    status: 409,
    description: 'Nickname conflict',
  })
  @ApiResponse({
    status: 422,
    description: 'Body request with invalid data',
  })
  @Post()
  async create(@Body() createDto: CreateDto) {
    const output = await this.createKnightUseCase.execute(createDto);
    return KnightsController.knightToResponse(output);
  }

  @ApiResponse({
    status: 200,
    description: 'Knight found',
    schema: {
      type: 'object',
      properties: {
        data: { $ref: getSchemaPath(KnightPresenter) },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
  @Get(':id')
  async get(@Param('id') id: string) {
    const output = await this.getKnightUseCase.execute({ id });
    return KnightsController.knightToResponse(output);
  }

  @ApiResponse({
    status: 200,
    description: 'Knight updated',
    schema: {
      type: 'object',
      properties: {
        data: { $ref: getSchemaPath(KnightPresenter) },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Body request with invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
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

  @ApiResponse({
    status: 204,
    description: 'Deletion confirmation response',
  })
  @ApiResponse({
    status: 404,
    description: 'Id not found',
  })
  @HttpCode(204)
  @Delete(':id')
  async heroify(@Param('id') id: string) {
    await this.heroifyKnightUseCase.execute({ id });
  }
}
