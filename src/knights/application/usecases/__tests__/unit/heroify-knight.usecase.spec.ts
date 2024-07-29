import KnightInMemoryRepository from '@/knights/infrastructure/database/in-memory/repositories/knight-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { KnightEntityFactory } from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import { HeroifyKnightUseCase } from '../../heroify-knight.usecase';
import { ActionAlreadyDoneError } from '@/shared/application/errors/action-already-done-error';

describe('HeroifyKnightUseCase unit tests', () => {
  let sut: HeroifyKnightUseCase.UseCase;
  let repository: KnightInMemoryRepository;

  beforeEach(() => {
    repository = new KnightInMemoryRepository();
    sut = new HeroifyKnightUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should throws error when knight already was heroified', async () => {
    const knight = KnightEntityFactory.create(KnightDataBuilder());

    knight.heroify();

    const items = [knight];

    repository.items = items;

    await expect(() => sut.execute({ id: knight._id })).rejects.toThrow(
      new ActionAlreadyDoneError(
        'The knight has already been transformed into a hero',
      ),
    );
  });

  it('Should be able to heroify knight', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');

    const items = [KnightEntityFactory.create(KnightDataBuilder())];

    repository.items = items;

    await sut.execute({ id: items[0]._id });

    expect(spyFindById).toHaveBeenCalledTimes(1);

    const knight = await repository.findById(items[0]._id);

    expect(knight.heroifiedAt).toBeInstanceOf(Date);
  });
});
