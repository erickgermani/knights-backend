import { Entity } from '@/shared/domain/entities/entity';
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository';
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: StubEntity[],
    filterBy: string | null,
  ): Promise<StubEntity[]> {
    if (!filterBy) return items;

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filterBy.toLowerCase()),
    );
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('applyFilter method', () => {
    it('Should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 100 })];

      const spyFilterMethod = jest.spyOn(items, 'filter');

      const itemsFiltered = await sut['applyFilter'](items, null);

      expect(items).toStrictEqual(itemsFiltered);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('Should filter items using filter param', async () => {
      const items = [
        new StubEntity({ name: 'TEST', price: 100 }),
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'fake', price: 100 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter');

      let itemsFiltered = await sut['applyFilter'](items, 'TEST');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut['applyFilter'](items, 'test');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await sut['applyFilter'](items, 'no-filter');

      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('Should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'b', price: 100 }),
      ];

      let itemsSorted = await sut['applySort'](items, null, null);

      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await sut['applySort'](items, 'price', 'asc');

      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await sut['applySort'](items, 'price', 'desc');

      expect(itemsSorted).toStrictEqual(items);
    });

    it('Should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'c', price: 100 }),
      ];

      let itemsSorted = await sut['applySort'](items, 'name', 'asc');

      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await sut['applySort'](items, 'name', 'desc');

      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPaginate method', () => {
    it('Should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'c', price: 100 }),
        new StubEntity({ name: 'd', price: 100 }),
        new StubEntity({ name: 'e', price: 100 }),
      ];

      let itemsPaginated = await sut['applyPaginate'](items, 1, 2);

      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await sut['applyPaginate'](items, 2, 2);

      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await sut['applyPaginate'](items, 3, 2);

      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await sut['applyPaginate'](items, 4, 2);

      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('Should apply only pagination when other params are null', async () => {
      const entity = new StubEntity({ name: 'test', price: 50 });
      const items = Array(16).fill(entity);
      sut.items = items;

      const params = await sut.search(new SearchParams());

      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDir: null,
          filterBy: null,
        }),
      );
    });

    it('Should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'TEST', price: 100 }),
        new StubEntity({ name: 'TeSt', price: 100 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filterBy: 'TEST',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDir: null,
          filterBy: 'TEST',
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filterBy: 'TEST',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDir: null,
          filterBy: 'TEST',
        }),
      );
    });

    it('Should apply paginate and sort', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 100 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'd', price: 100 }),
        new StubEntity({ name: 'e', price: 100 }),
        new StubEntity({ name: 'c', price: 100 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filterBy: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[2]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filterBy: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filterBy: null,
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1]],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filterBy: null,
        }),
      );
    });

    it('Should search using paginate, sort and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 100 }),
        new StubEntity({ name: 'a', price: 100 }),
        new StubEntity({ name: 'TEST', price: 100 }),
        new StubEntity({ name: 'e', price: 100 }),
        new StubEntity({ name: 'TeSt', price: 100 }),
      ];
      sut.items = items;

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filterBy: 'TEST',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[4]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filterBy: 'TEST',
        }),
      );

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filterBy: 'TEST',
        }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[2]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'desc',
          filterBy: 'TEST',
        }),
      );
    });
  });
});
