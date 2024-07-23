import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { KnightProps } from '../entities/knight.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';

class Attributes {
  @IsNumber()
  @Min(0)
  @Max(20)
  strength: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  dexterity: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  constituition: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  intelligence: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  wisdom: number;

  @IsNumber()
  @Min(0)
  @Max(20)
  charisma: number;
}

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

  @IsNotEmptyObject()
  attributes: Attributes;

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
