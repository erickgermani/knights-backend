import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { KnightOutput, KnightOutputMapper } from '../dtos/knight-output';
import { UseCase as DefaultKnightCase } from '@/shared/application/usecases/use-case';
import { ActionAlreadyDoneError } from '@/shared/application/errors/action-already-done-error';

export namespace HeroifyKnightUseCase {
  export type Input = {
    id: string;
  };

  export type Output = KnightOutput;

  export class UseCase implements DefaultKnightCase<Input, Output> {
    constructor(private knightRepository: KnightRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.knightRepository.findById(input.id);

      if (entity.heroifiedAt)
        throw new ActionAlreadyDoneError(
          'The knight has already been transformed into a hero',
        );

      entity.heroify();

      await this.knightRepository.update(entity);

      return KnightOutputMapper.toOutput(entity);
    }
  }
}
