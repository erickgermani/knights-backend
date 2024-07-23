import { KnightEntity } from '@/knights/domain/entities/knight.entity';

export type KnightOutput = {
  id: string;
  name: string;
  age: number;
  weapons: number;
  keyAttribute: string;
  attack: number;
  experience: number;
  createdAt: Date;
};

export class KnightOutputMapper {
  static toOutput(entity: KnightEntity): KnightOutput {
    return entity.toJSON();
  }
}
