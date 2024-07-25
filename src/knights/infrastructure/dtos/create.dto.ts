import { CreateKnightUseCase } from '@/knights/application/usecases/create-knight.usecase';
import { Attributes } from '@/knights/domain/entities/knight.entity';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WeaponDto } from './weapon.dto';
import { AttributesDto } from './attributes.dto';

export class CreateDto implements CreateKnightUseCase.Input {
  @ApiProperty({ description: 'Knight name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Knight nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ description: 'Knight birthday' })
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @ApiProperty({ description: 'Knight weapons', type: [WeaponDto] })
  @IsArray()
  @ArrayNotEmpty()
  weapons: WeaponDto[];

  @ApiProperty({ description: 'Knight attributes' })
  @IsObject()
  @IsNotEmptyObject()
  attributes: AttributesDto;

  @ApiProperty({ description: 'Knight key attribute', type: String })
  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  keyAttribute: keyof Attributes;

  @ApiProperty({ description: 'Knight creation date' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  createdAt?: Date;
}
