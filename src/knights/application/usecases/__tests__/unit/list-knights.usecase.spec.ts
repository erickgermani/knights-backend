import { ListKnightsUseCase } from '../../list-knights.usecase';
import KnightInMemoryRepository from '@/knights/infrastructure/database/in-memory/repositories/knight-in-memory.repository';
import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';

describe('ListKnightsUseCase unit tests', () => {
  let sut: ListKnightsUseCase.UseCase;
  let repository: KnightInMemoryRepository;

  beforeEach(() => {
    repository = new KnightInMemoryRepository();
    sut = new ListKnightsUseCase.UseCase(repository);
  });

  it('toOutput method', () => {
    let result = new KnightRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });

    let output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });

    const entity = new KnightEntity(KnightDataBuilder());

    result = new KnightRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });

    output = sut['toOutput'](result);

    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });
  });

  it('Should return the knights ordered by createdAt', async () => {
    const createdAt = new Date();

    const items = [
      new KnightEntity(KnightDataBuilder({ createdAt })),
      new KnightEntity(
        KnightDataBuilder({ createdAt: new Date(createdAt.getTime() + 1) }),
      ),
    ];

    repository.items = items;

    const output = await sut.execute({});

    expect(output).toStrictEqual({
      items: [...items.reverse()].map((item) => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });

  it('Should return the knights using pagination, sort and filter', async () => {
    const items = [
      new KnightEntity(KnightDataBuilder({ name: 'a' })),
      new KnightEntity(KnightDataBuilder({ name: 'AA' })),
      new KnightEntity(KnightDataBuilder({ name: 'Aa' })),
      new KnightEntity(KnightDataBuilder({ name: 'b' })),
      new KnightEntity(KnightDataBuilder({ name: 'c' })),
    ];

    repository.items = items;

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    });

    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    });
  });
});
