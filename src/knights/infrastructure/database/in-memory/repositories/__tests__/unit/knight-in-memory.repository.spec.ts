import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import KnightInMemoryRepository from '../../knight-in-memory.repository';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('KnightInMemoryRepository unit tests', () => {
  let sut: KnightInMemoryRepository;

  beforeEach(() => {
    sut = new KnightInMemoryRepository();
  });

  describe('nicknameExists method', () => {
    it('Should throw error when not found', async () => {
      const entity = new KnightEntity(
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

  describe('applyFilter', () => {
    it('Should no filter items when filter object is null', async () => {
      const entity = new KnightEntity(KnightDataBuilder());

      await sut.insert(entity);

      const result = await sut.findAll();

      const spyFilter = jest.spyOn(result, 'filter');

      const itemsFiltered = await sut['applyFilter'](result, null);

      expect(spyFilter).not.toHaveBeenCalled();
      expect(result).toStrictEqual(itemsFiltered);
    });

    it('Should filter name field using filter param', async () => {
      const items = [
        new KnightEntity(KnightDataBuilder({ name: 'Test' })),
        new KnightEntity(KnightDataBuilder({ name: 'TEST' })),
        new KnightEntity(KnightDataBuilder({ name: 'fake' })),
      ];

      const spyFilter = jest.spyOn(items, 'filter');

      const itemsFiltered = await sut['applyFilter'](items, 'test');

      expect(spyFilter).toHaveBeenCalled();
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
    });
  });

  describe('applySort', () => {
    it('Should sort by createdAt when sort param is null', async () => {
      const createdAt = new Date();

      const items = [
        new KnightEntity(KnightDataBuilder({ name: 'Test', createdAt })),
        new KnightEntity(
          KnightDataBuilder({
            name: 'TEST',
            createdAt: new Date(createdAt.getTime() + 1),
          }),
        ),
        new KnightEntity(
          KnightDataBuilder({
            name: 'fake',
            createdAt: new Date(createdAt.getTime() + 2),
          }),
        ),
      ];

      const itemsSortered = await sut['applySort'](items, null, null);

      expect(itemsSortered).toStrictEqual([items[2], items[1], items[0]]);
    });

    it('Should sort by name field', async () => {
      const items = [
        new KnightEntity(KnightDataBuilder({ name: 'c' })),
        new KnightEntity(
          KnightDataBuilder({
            name: 'd',
          }),
        ),
        new KnightEntity(
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
});
