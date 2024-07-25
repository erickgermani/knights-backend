import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { KnightOutput, KnightOutputMapper } from '../dtos/knight-output';
import { UseCase as DefaultKnightCase } from '@/shared/application/usecases/use-case';

export namespace HeroifyKnightUseCase {
  export type Input = {
    id: string;
  };

  export type Output = KnightOutput;

  export class UseCase implements DefaultKnightCase<Input, Output> {
    constructor(private knightRepository: KnightRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.knightRepository.findById(input.id);

      entity.heroify();

      await this.knightRepository.update(entity);

      return KnightOutputMapper.toOutput(entity);
    }
  }
}
