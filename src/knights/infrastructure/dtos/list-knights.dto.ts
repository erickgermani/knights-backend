import { ListKnightsUseCase } from '@/knights/application/usecases/list-knights.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListKnightsDto implements ListKnightsUseCase.Input {
  @ApiPropertyOptional({ description: 'Page number that will returned' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantity of registers per page' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Defined column to order data: "name" or "createdAt"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Defined direction to order data: "asc" or "desc"',
  })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({ description: 'Defined filter to search data' })
  @IsOptional()
  filterBy?: string;
}
