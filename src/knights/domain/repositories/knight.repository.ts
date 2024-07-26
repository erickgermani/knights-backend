import { KnightEntity } from '../entities/knight.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchProps as DefaultSearchProps,
  SearchableRepositoryInterface,
  SearchResultProps as DefaultSearchResultProps,
} from '@/shared/domain/repositories/searchable-repository-contracts';

namespace KnightRepository {
  export type Filter = string;

  type SearchProps<Filter> = DefaultSearchProps<Filter> & {
    filter?: string;
  };

  export class SearchParams extends DefaultSearchParams<Filter> {
    protected _filter: string;

    constructor(props: SearchProps<Filter> = {}) {
      super(props);
      this.filter = props.filter;
    }

    get filter() {
      return this._filter;
    }

    private set filter(value: string) {
      this._filter = typeof value !== 'string' || !value ? null : value;
    }
  }

  type SearchResultProps<
    E extends KnightEntity,
    Filter,
  > = DefaultSearchResultProps<E, Filter> & {
    filter: string | null;
  };

  export class SearchResult extends DefaultSearchResult<KnightEntity, Filter> {
    readonly filter: string | null;

    constructor(props: SearchResultProps<KnightEntity, Filter>) {
      super(props);
      this.filter = props.filter;
    }
  }

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
