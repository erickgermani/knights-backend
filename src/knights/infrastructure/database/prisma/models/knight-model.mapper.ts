import { ValidationError } from '@/shared/domain/errors/validation-error';
import {
  Attributes,
  KnightEntity,
  Weapon,
} from '@/knights/domain/entities/knight.entity';
import { Knight } from '@prisma/client';

class KnightModelMapper {
  static toEntity(model: Knight) {
    const data = {
      name: model.name,
      nickname: model.nickname,
      birthday: model.birthday,
      weapons: model.weapons as Weapon[],
      attributes: model.attributes as Attributes,
      keyAttribute: model.keyAttribute,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    try {
      return new KnightEntity(data, model.id);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}

export default KnightModelMapper;
