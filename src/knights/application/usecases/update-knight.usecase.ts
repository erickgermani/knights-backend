import KnightRepository from '@/knights/domain/repositories/knight.repository';
import { KnightOutput, KnightOutputMapper } from '../dtos/knight-output';
import { UseCase as DefaultKnightCase } from '@/shared/application/usecases/use-case';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

namespace UpdateKnightUseCase {
  export type Input = {
    id: string;
    nickname: string;
  };

  export type Output = KnightOutput;

  export class UseCase implements DefaultKnightCase<Input, Output> {
    constructor(private knightRepository: KnightRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      if (!input.nickname) throw new BadRequestError('Nickname not provided');

      await this.knightRepository.nicknameExists(input.nickname);

      const entity = await this.knightRepository.findById(input.id);

      entity.updateNickname(input.nickname);

      await this.knightRepository.update(entity);

      return KnightOutputMapper.toOutput(entity);
    }
  }
}

export default UpdateKnightUseCase;
