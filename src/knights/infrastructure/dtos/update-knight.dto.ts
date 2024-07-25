import UpdateKnightUseCase from '@/knights/application/usecases/update-knight.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateKnightDto implements Omit<UpdateKnightUseCase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
