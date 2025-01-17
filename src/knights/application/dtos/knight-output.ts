import {
  Attributes,
  KnightEntity,
  Weapon,
} from '@/knights/domain/entities/knight.entity';

export type KnightOutput = {
  id: string;
  name: string;
  nickname: string;
  birthday: Date;
  weapons: Weapon[];
  attributes: Attributes;
  keyAttribute: keyof Attributes;
  heroifiedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
};

export class KnightOutputMapper {
  static toOutput(entity: KnightEntity): KnightOutput {
    return entity.toJSON();
  }
}
