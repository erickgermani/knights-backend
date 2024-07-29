import { ValidationError } from '@/shared/domain/errors/validation-error';
import {
  Attributes,
  KnightEntity,
  KnightEntityFactory,
  KnightProps,
  Weapon,
} from '@/knights/domain/entities/knight.entity';
import { Knight } from '@prisma/client';

class KnightModelMapper {
  static toEntity(model: Knight) {
    const data: KnightProps = {
      name: model.name,
      nickname: model.nickname,
      birthday: model.birthday,
      weapons: model.weapons as Weapon[],
      attributes: model.attributes as Attributes,
      keyAttribute: model.keyAttribute,
      heroifiedAt: model.heroifiedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };

    if (model.heroifiedAt) data.heroifiedAt = model.heroifiedAt;
    if (model.updatedAt) data.updatedAt = model.updatedAt;

    try {
      return KnightEntityFactory.create(data, model.id);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}

export default KnightModelMapper;
