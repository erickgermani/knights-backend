import ColletionPresenter from '@/shared/infrastructure/presenters/collection.presenter';
import { KnightOutput } from '@/knights/application/dtos/knight-output';
import { ListKnightsUseCase } from '@/knights/application/usecases/list-knights.usecase';
import { Attributes, Weapon } from '@/knights/domain/entities/knight.entity';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeaponDto } from '../dtos/weapon.dto';
import { AttributesDto } from '../dtos/attributes.dto';

class KnightPresenter {
  @ApiProperty({ description: 'Knight id' })
  id: string;

  @ApiProperty({ description: 'Knight name' })
  name: string;

  @ApiProperty({ description: 'Knight nickname' })
  nickname: string;

  @ApiProperty({ description: 'Knight birthday' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  birthday: Date;

  @ApiProperty({ description: 'Knight weapons', type: [WeaponDto] })
  weapons: Weapon[];

  @ApiProperty({ description: 'Knight attributes', type: [AttributesDto] })
  attributes: Attributes;

  @ApiProperty({ description: 'Knight key attribute', type: String })
  keyAttribute: keyof Attributes;

  @ApiPropertyOptional({ description: 'Date the knight was heroized ' })
  @Transform(({ value }: { value: Date }) =>
    value ? value.toISOString() : value,
  )
  heroifiedAt?: Date;

  @ApiProperty({ description: 'Knight creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Knight update date' })
  @Transform(({ value }: { value: Date }) =>
    value ? value.toISOString() : value,
  )
  updatedAt?: Date;

  constructor(output: KnightOutput) {
    this.id = output.id;
    this.name = output.name;
    this.nickname = output.nickname;
    this.birthday = output.birthday;
    this.weapons = output.weapons;
    this.attributes = output.attributes;
    this.keyAttribute = output.keyAttribute;
    this.createdAt = output.createdAt;

    if (output.heroifiedAt) this.heroifiedAt = output.heroifiedAt;
    if (output.updatedAt) this.updatedAt = output.updatedAt;
  }
}

class KnightCollectionPresenter extends ColletionPresenter {
  data: KnightPresenter[];

  constructor(output: ListKnightsUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new KnightPresenter(item));
  }
}

export { KnightCollectionPresenter };
export default KnightPresenter;
