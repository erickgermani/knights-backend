import {
  KnightEntity,
  KnightEntityFactory,
} from '@/knights/domain/entities/knight.entity';
import KnightInMemoryRepository from '../../knight-in-memory.repository';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import KnightRepository from '@/knights/domain/repositories/knight.repository';

describe('KnightInMemoryRepository unit tests', () => {
  let sut: KnightInMemoryRepository;

  beforeEach(() => {
    sut = new KnightInMemoryRepository();
  });

  describe('nicknameExists method', () => {
    it('Should throw error when not found', async () => {
      const entity = KnightEntityFactory.create(
        KnightDataBuilder({ nickname: 'john.knight' }),
      );

      await sut.insert(entity);

      await expect(sut.nicknameExists(entity.nickname)).rejects.toThrow(
        new ConflictError('Nickname already used'),
      );
    });

    it('Should find a entity by nickname', async () => {
      expect.assertions(0);

      await sut.nicknameExists('unknownnickname');
    });
  });

  describe('applyFilter method', () => {
    it('Should no filter items when filter object is null', async () => {
      const entity = KnightEntityFactory.create(KnightDataBuilder());

      await sut.insert(entity);

      const result = await sut.findAll();

      const spyFilter = jest.spyOn(result, 'filter');

      const itemsFiltered = await sut['applyFilter'](result, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(result).toStrictEqual(itemsFiltered);
    });

    it('Should filter name field using filter param', async () => {
      const items = [
        KnightEntityFactory.create(KnightDataBuilder({ name: 'Test' })),
        KnightEntityFactory.create(KnightDataBuilder({ name: 'TEST' })),
        KnightEntityFactory.create(KnightDataBuilder({ name: 'fake' })),
      ];

      const spyFilter = jest.spyOn(items, 'filter');

      const itemsFiltered = await sut['applyFilter'](items, 'test');

      expect(spyFilter).toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
    });
  });

  describe('applySort method', () => {
    it('Should sort by name field', async () => {
      const items = [
        KnightEntityFactory.create(KnightDataBuilder({ name: 'c' })),
        KnightEntityFactory.create(
          KnightDataBuilder({
            name: 'd',
          }),
        ),
        KnightEntityFactory.create(
          KnightDataBuilder({
            name: 'a',
          }),
        ),
      ];

      let itemsSortered = await sut['applySort'](items, 'name', 'asc');

      expect(itemsSortered).toStrictEqual([items[2], items[0], items[1]]);

      itemsSortered = await sut['applySort'](items, 'name', null);

      expect(itemsSortered).toStrictEqual([items[1], items[0], items[2]]);
    });
  });

  describe('search method', () => {
    it('Should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = Array(16).fill(KnightDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          KnightEntityFactory.create({
            ...element,
            name: `Knight #${index}`,
            nickname: `Knight #${index}`,
            createdAt: new Date(createdAt.getTime() + index * 1000),
          }),
        );
      });

      sut.items = entities;

      const searchOutput = await sut.search(
        new KnightRepository.SearchParams(),
      );

      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(KnightRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(KnightEntity);
      });

      expect(searchOutput.currentPage).toBe(1);

      items.forEach((item, index) => {
        expect(`Knight #${index}`).toBe(item.name);
      });
    });

    it('Should return only heroified knights when filter param is "heroes"', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = Array(3).fill(KnightDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          KnightEntityFactory.create({
            ...element,
            name: `Knight #${index}`,
            createdAt: new Date(createdAt.getTime() + index * 1000),
            heroifiedAt: index % 2 ? undefined : new Date(),
          }),
        );
      });

      sut.items = entities;

      const searchOutput = await sut.search(
        new KnightRepository.SearchParams({ filter: 'heroes' }),
      );

      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(KnightRepository.SearchResult);
      expect(searchOutput.total).toBe(2);
      expect(searchOutput.items.length).toBe(2);

      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(KnightEntity);
      });

      expect(searchOutput.currentPage).toBe(1);

      expect([entities[0], entities[2]]).toStrictEqual(items);
    });

    it('Should search using filter, sort and paginate', async () => {
      const createdAt = new Date();

      const entities: KnightEntity[] = [];

      const arrange = ['test1', 'a', 'test3', 'b', 'test2'];

      arrange.forEach((element, index) => {
        entities.push(
          KnightEntityFactory.create({
            ...KnightDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index * 1000),
          }),
        );
      });

      sut.items = entities;

      const searchOutputPage1 = await sut.search(
        new KnightRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filterBy: 'test',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toStrictEqual(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toStrictEqual(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new KnightRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filterBy: 'test',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toStrictEqual(
        entities[2].toJSON(),
      );
    });
  });
});
