import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class AttributesDto {
  @ApiProperty({ description: 'Knight strength' })
  @IsNumber()
  @Min(0)
  @Max(20)
  strength: number;

  @ApiProperty({ description: 'Knight dexterity' })
  @IsNumber()
  @Min(0)
  @Max(20)
  dexterity: number;

  @ApiProperty({ description: 'Knight constitution' })
  @IsNumber()
  @Min(0)
  @Max(20)
  constitution: number;

  @ApiProperty({ description: 'Knight intelligence' })
  @IsNumber()
  @Min(0)
  @Max(20)
  intelligence: number;

  @ApiProperty({ description: 'Knight wisdom' })
  @IsNumber()
  @Min(0)
  @Max(20)
  wisdom: number;

  @ApiProperty({ description: 'Knight charisma' })
  @IsNumber()
  @Min(0)
  @Max(20)
  charisma: number;
}
