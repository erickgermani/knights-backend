import KnightInMemoryRepository from '@/knights/infrastructure/database/in-memory/repositories/knight-in-memory.repository';
import { GetKnightUseCase } from '../../get-knight.usecase';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import {
  KnightEntity,
  KnightEntityFactory,
} from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';

describe('GetKnightUseCase unit tests', () => {
  let sut: GetKnightUseCase.UseCase;
  let repository: KnightInMemoryRepository;

  beforeEach(() => {
    repository = new KnightInMemoryRepository();
    sut = new GetKnightUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should be able to get knight profile', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');

    const items = [KnightEntityFactory.create(KnightDataBuilder())];

    repository.items = items;

    const result = await sut.execute({ id: items[0]._id });

    expect(spyFindById).toHaveBeenCalledTimes(1);

    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      nickname: items[0].nickname,
      birthday: items[0].birthday,
      weapons: items[0].weapons,
      attributes: items[0].attributes,
      keyAttribute: items[0].keyAttribute,
      createdAt: items[0].createdAt,
    });
  });
});
