import { instanceToPlain } from 'class-transformer';
import PaginationPresenter from '../../pagination.presenter';
import ColletionPresenter from '../../collection.presenter';

class StubCollectionPresenter extends ColletionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter unit tests', () => {
  let sut: StubCollectionPresenter;

  beforeEach(() => {
    sut = new StubCollectionPresenter({
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
      total: 4,
    });
  });

  describe('constructor', () => {
    it('Should set values', () => {
      expect(sut['paginationPresenter']).toBeInstanceOf(PaginationPresenter);
      expect(sut['paginationPresenter'].currentPage).toBe(1);
      expect(sut['paginationPresenter'].perPage).toBe(2);
      expect(sut['paginationPresenter'].lastPage).toBe(2);
      expect(sut['paginationPresenter'].total).toBe(4);
    });
  });

  it('Should presenter data', () => {
    const output = instanceToPlain(sut);

    expect(output).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        total: 4,
      },
    });
  });
});
