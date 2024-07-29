import KnightRepository from '@/knights/domain/repositories/knight.repository';
import {
  Attributes,
  KnightEntity,
  KnightEntityFactory,
  Weapon,
} from '@/knights/domain/entities/knight.entity';
import { KnightOutput, KnightOutputMapper } from '../dtos/knight-output';
import { UseCase as DefaultKnightCase } from '@/shared/application/usecases/use-case';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';

export namespace CreateKnightUseCase {
  export type Input = {
    name: string;
    nickname: string;
    birthday: Date;
    weapons: Weapon[];
    attributes: Attributes;
    keyAttribute: keyof Attributes;
  };

  export type Output = KnightOutput;

  export class UseCase implements DefaultKnightCase<Input, Output> {
    constructor(private knightRepository: KnightRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { name, nickname, birthday, weapons, attributes, keyAttribute } =
        input;

      if (
        !name ||
        !nickname ||
        !birthday ||
        !weapons ||
        !weapons.length ||
        !attributes ||
        !keyAttribute
      )
        throw new BadRequestError('Input data not provided');

      await this.knightRepository.nicknameExists(nickname);

      const entity = KnightEntityFactory.create(input);

      await this.knightRepository.insert(entity);

      return KnightOutputMapper.toOutput(entity);
    }
  }
}
