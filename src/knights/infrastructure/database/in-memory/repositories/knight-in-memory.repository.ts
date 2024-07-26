import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export default class KnightInMemoryRepository
  extends InMemorySearchableRepository<KnightEntity>
  implements KnightRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt'];

  async nicknameExists(nickname: string): Promise<void> {
    const items = await this.findAll();

    const entity = items.find((item) => item.nickname === nickname);

    if (entity) throw new ConflictError('Nickname already used');
  }

  async search(
    props: KnightRepository.SearchParams,
  ): Promise<KnightRepository.SearchResult> {
    const items = await this.findAll();

    const heroifiedItems = props.filter
      ? items.filter((item) => item.heroifiedAt)
      : items;

    const itemsFiltered = await this.applyFilter(
      heroifiedItems,
      props.filterBy,
    );

    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDir,
    );

    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      props.page,
      props.perPage,
    );

    return new KnightRepository.SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDir: props.sortDir,
      filterBy: props.filterBy,
      filter: props.filter,
    });
  }

  protected async applyFilter(
    items: KnightEntity[],
    filterBy: KnightRepository.Filter,
  ): Promise<KnightEntity[]> {
    if (!filterBy) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filterBy.toLowerCase()),
    );
  }

  protected async applySort(
    items: KnightEntity[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<KnightEntity[]> {
    return !sort ? items : super.applySort(items, sort, sortDir);
  }
}
