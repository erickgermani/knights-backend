import { CreateKnightUseCase } from '@/knights/application/usecases/create-knight.usecase';
import { Attributes } from '@/knights/domain/entities/knight.entity';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

class AttributesDto {
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

class WeaponDto {
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

export class CreateDto implements CreateKnightUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsDate()
  birthday: Date;

  @IsArray()
  @ArrayNotEmpty()
  weapons: WeaponDto[];

  @IsObject()
  @IsNotEmptyObject()
  attributes: AttributesDto;

  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  keyAttribute: keyof Attributes;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
