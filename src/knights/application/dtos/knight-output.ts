import {
  Attributes,
  KnightEntity,
  Weapon,
} from '@/knights/domain/entities/knight.entity';

export type KnightOutput = {
  id: string;
  name: string;
  // nickname: string;
  age: number;
  weapons: number;
  // attributes: Attributes;
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
