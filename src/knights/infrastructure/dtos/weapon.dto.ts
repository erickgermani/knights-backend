import { Attributes } from '@/knights/domain/entities/knight.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class WeaponDto {
  @ApiProperty({ description: 'Weapon name' })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Weapon mod' })
  @IsNumber()
  mod: number;

  @ApiProperty({ description: 'Weapon attr' })
  @MaxLength(12)
  @IsString()
  @IsNotEmpty()
  attr: keyof Attributes;

  @ApiProperty({ description: 'Weapon equipped' })
  @IsBoolean()
  equipped: boolean;
}
