import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import KnightRepository from '@/knights/domain/repositories/knight.repository';

export default class KnightInMemoryRepository
  extends InMemorySearchableRepository<KnightEntity>
  implements KnightRepository.Repository
{
  sortableFields: string[] = ['name', 'createdAt'];

  protected async applyFilter(
    items: KnightEntity[],
    filter: KnightRepository.Filter,
  ): Promise<KnightEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected async applySort(
    items: KnightEntity[],
    sort: string | null,
    sortDir: SortDirection | null,
  ): Promise<KnightEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
