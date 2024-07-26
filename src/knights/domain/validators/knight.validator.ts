import 'reflect-metadata';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { KnightProps } from '../entities/knight.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { Type } from 'class-transformer';

class AttributesRules {
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
  constitution: number;

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

class WeaponRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  mod: number;

  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  attr: string;

  @IsBoolean()
  equipped: boolean;
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
  birthday: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayNotEmpty()
  @Type(() => WeaponRules)
  @ValidateNested({ each: true })
  weapons: WeaponRules[];

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => AttributesRules)
  @ValidateNested()
  attributes: AttributesRules;

  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'charisma',
    'constitution',
    'dexterity',
    'intelligence',
    'strength',
    'wisdom',
  ])
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
