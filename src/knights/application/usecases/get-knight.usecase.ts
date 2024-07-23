import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { UseCase as DefaultKnightCase } from '@/shared/application/usecases/use-case';
import { KnightOutput, KnightOutputMapper } from '../dtos/knight-output';

namespace GetKnightUseCase {
  export type Input = {
    id: string;
  };

  export type Output = KnightOutput;

  export class UseCase implements DefaultKnightCase<Input, Output> {
    constructor(private knightRepository: KnightRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.knightRepository.findById(input.id);

      return KnightOutputMapper.toOutput(entity);
    }
  }
}

export default GetKnightUseCase;
