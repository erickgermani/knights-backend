import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contracts';

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const sut = new SearchParams();

      expect(sut.page).toBe(1);

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 'test', expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.5, expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: {}, expected: 1 },
        { page: 1, expected: 1 },
        { page: 2, expected: 2 },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ page: i.page }).page).toBe(i.expected);
      });
    });

    it('perPage prop', () => {
      const sut = new SearchParams();

      expect(sut.perPage).toBe(15);

      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: -1, expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 16, expected: 16 },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ perPage: i.perPage }).perPage).toBe(
          i.expected,
        );
      });
    });

    it('sort prop', () => {
      const sut = new SearchParams();

      expect(sut.sort).toBeNull();

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined, expected: null },
        { sort: '', expected: null },
        { sort: 'test', expected: 'test' },
        { sort: 0, expected: '0' },
        { sort: -1, expected: '-1' },
        { sort: 5.5, expected: '5.5' },
        { sort: true, expected: 'true' },
        { sort: false, expected: 'false' },
        { sort: {}, expected: '[object Object]' },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ sort: i.sort }).sort).toBe(i.expected);
      });
    });

    it('sortDir prop', () => {
      let sut = new SearchParams();

      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: null });
      expect(sut.sortDir).toBeNull();

      const params = [
        { sortDir: null as any, expected: 'asc' },
        { sortDir: undefined, expected: 'asc' },
        { sortDir: '', expected: 'asc' },
        { sortDir: 'test', expected: 'asc' },
        { sortDir: 0, expected: 'asc' },
        { sortDir: -1, expected: 'asc' },
        { sortDir: 5.5, expected: 'asc' },
        { sortDir: true, expected: 'asc' },
        { sortDir: false, expected: 'asc' },
        { sortDir: {}, expected: 'asc' },
        { sortDir: 'asc', expected: 'asc' },
        { sortDir: 'Asc', expected: 'asc' },
        { sortDir: 'desc', expected: 'desc' },
        { sortDir: 'Desc', expected: 'desc' },
      ];

      params.forEach((i) => {
        expect(
          new SearchParams({ sort: 'field', sortDir: i.sortDir }).sortDir,
        ).toBe(i.expected);
      });
    });

    it('filterBy prop', () => {
      const sut = new SearchParams();

      expect(sut.filterBy).toBeNull();

      const params = [
        { filterBy: null as any, expected: null },
        { filterBy: undefined, expected: null },
        { filterBy: '', expected: null },
        { filterBy: 'test', expected: 'test' },
        { filterBy: 0, expected: '0' },
        { filterBy: -1, expected: '-1' },
        { filterBy: 5.5, expected: '5.5' },
        { filterBy: true, expected: 'true' },
        { filterBy: false, expected: 'false' },
        { filterBy: {}, expected: '[object Object]' },
      ];

      params.forEach((i) => {
        expect(new SearchParams({ filterBy: i.filterBy }).filterBy).toBe(
          i.expected,
        );
      });
    });
  });

  describe('SearchResult tests', () => {
    it('constructor props', () => {
      let sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filterBy: null,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filterBy: null,
      });

      sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filterBy: 'test',
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filterBy: 'test',
      });

      sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filterBy: 'test',
      });

      expect(sut.lastPage).toBe(1);

      sut = new SearchResult({
        items: ['test1', 'test2', 'test3', 'test4'] as any,
        total: 54,
        currentPage: 6,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filterBy: 'test',
      });

      expect(sut.lastPage).toBe(6);
    });
  });
});
