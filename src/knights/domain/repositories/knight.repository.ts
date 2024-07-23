import { KnightEntity } from '../entities/knight.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

namespace KnightRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<KnightEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      KnightEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    nicknameExists(nickname: string): Promise<void>;
  }
}

export default KnightRepository;
