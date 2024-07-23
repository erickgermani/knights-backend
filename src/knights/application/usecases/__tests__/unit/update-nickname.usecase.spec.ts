import KnightInMemoryRepository from '@/knights/infrastructure/database/in-memory/repositories/knight-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { KnightEntity } from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import UpdateKnightUseCase from '../../update-knight.usecase';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

describe('UpdateKnightUseCase unit tests', () => {
  let sut: UpdateKnightUseCase.UseCase;
  let repository: KnightInMemoryRepository;

  beforeEach(() => {
    repository = new KnightInMemoryRepository();
    sut = new UpdateKnightUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', nickname: 'test nickname' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throws error when nickname not provided', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', nickname: '' }),
    ).rejects.toThrow(new BadRequestError('Nickname not provided'));
  });

  it('Should be able to get knight profile', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');

    const items = [new KnightEntity(KnightDataBuilder())];

    repository.items = items;

    const result = await sut.execute({
      id: items[0]._id,
      nickname: 'new nickname',
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: items[0].id,
      nickname: 'new nickname',
      createdAt: items[0].createdAt,
    });
  });
});
