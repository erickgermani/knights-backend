import UpdateKnightUseCase from '@/knights/application/usecases/update-knight.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKnightDto implements Omit<UpdateKnightUseCase.Input, 'id'> {
  @ApiProperty({ description: 'Knight nickname' })
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
