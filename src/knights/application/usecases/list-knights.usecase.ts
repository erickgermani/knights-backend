import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { KnightOutput, KnightOutputMapper } from '../dtos/knight-output';
import { UseCase as DefaultKnightCase } from '@/shared/application/usecases/use-case';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { SearchInput } from '@/shared/application/dtos/search-input';

export namespace ListKnightsUseCase {
  export type Input = SearchInput & { filter?: string };

  export type Output = PaginationOutput<KnightOutput>;

  export class UseCase implements DefaultKnightCase<Input, Output> {
    constructor(private knightRepository: KnightRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new KnightRepository.SearchParams(input);

      const searchResult = await this.knightRepository.search(params);

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: KnightRepository.SearchResult): Output {
      const items = searchResult.items.map((item) => {
        return KnightOutputMapper.toOutput(item);
      });

      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
