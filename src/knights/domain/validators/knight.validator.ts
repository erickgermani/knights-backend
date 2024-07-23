import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { KnightProps } from '../entities/knight.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';

export class KnightRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @IsArray()
  @ArrayNotEmpty()
  weapons: Array<{
    name: string;
    mod: number;
    attr: string;
    equipped: boolean;
  }>;

  @IsNotEmpty()
  attributes: {
    strength: number;
    dexterity: number;
    constituition: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };

  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  keyAttribute: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({
    name,
    nickname,
    birthday,
    attributes,
    weapons,
    keyAttribute,
    createdAt,
  }: KnightProps) {
    Object.assign(this, {
      name,
      nickname,
      birthday,
      attributes,
      weapons,
      keyAttribute,
      createdAt,
    });
  }
}

export class KnightValidator extends ClassValidatorFields<KnightRules> {
  validate(data: KnightProps): boolean {
    return super.validate(new KnightRules(data ?? ({} as KnightProps)));
  }
}

export class KnightValidatorFactory {
  static create(): KnightValidator {
    return new KnightValidator();
  }
}
