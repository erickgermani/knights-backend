import KnightInMemoryRepository from '@/knights/infrastructure/database/in-memory/repositories/knight-in-memory.repository';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { CreateKnightUseCase } from '../../create-knight.usecase';

describe('CreateKnightUseCase unit tests', () => {
  let sut: CreateKnightUseCase.UseCase;
  let repository: KnightInMemoryRepository;

  beforeEach(() => {
    repository = new KnightInMemoryRepository();
    sut = new CreateKnightUseCase.UseCase(repository);
  });

  it('Should create a knight', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');

    const props = KnightDataBuilder();

    const result = await sut.execute(props);

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('Should not be able to register with same nickname twice', async () => {
    const props = KnightDataBuilder({ nickname: 'john.knight' });

    await sut.execute(props);

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it('Should throws error when props is not provided', async () => {
    let props = Object.assign(KnightDataBuilder(), { name: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = Object.assign(KnightDataBuilder(), { nickname: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = Object.assign(KnightDataBuilder(), { birthday: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = Object.assign(KnightDataBuilder(), { weapons: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = Object.assign(KnightDataBuilder(), { attributes: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );

    props = Object.assign(KnightDataBuilder(), { keyAttribute: null });

    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
