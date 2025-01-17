import { instanceToPlain } from 'class-transformer';
import PaginationPresenter from '../../pagination.presenter';

describe('PaginationPresenter unit tests', () => {
  describe('constructor', () => {
    it('Should set values', () => {
      const props = {
        currentPage: 1,
        perPage: 2,
        lastPage: 3,
        total: 4,
      };

      const sut = new PaginationPresenter(props);

      expect(sut.currentPage).toEqual(props.currentPage);
      expect(sut.perPage).toEqual(props.perPage);
      expect(sut.lastPage).toEqual(props.lastPage);
      expect(sut.total).toEqual(props.total);
    });

    it('Should set strings values', () => {
      const props = {
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '3' as any,
        total: '4' as any,
      };

      const sut = new PaginationPresenter(props);

      expect(sut.currentPage).toEqual(props.currentPage);
      expect(sut.perPage).toEqual(props.perPage);
      expect(sut.lastPage).toEqual(props.lastPage);
      expect(sut.total).toEqual(props.total);
    });
  });

  it('Should presenter data', () => {
    let props = {
      currentPage: 1,
      perPage: 2,
      lastPage: 3,
      total: 4,
    };

    let sut = new PaginationPresenter(props);

    let output = instanceToPlain(sut);

    expect(output).toEqual(props);

    props = {
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '3' as any,
      total: '4' as any,
    };

    sut = new PaginationPresenter(props);

    output = instanceToPlain(sut);

    expect(output).toEqual({
      currentPage: 1,
      perPage: 2,
      lastPage: 3,
      total: 4,
    });
  });
});
