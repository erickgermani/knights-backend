import ColletionPresenter from '@/shared/infrastructure/presenters/collection.presenter';
import { KnightOutput } from '@/knights/application/dtos/knight-output';
import { ListKnightsUseCase } from '@/knights/application/usecases/list-knights.usecase';
import { Attributes, Weapon } from '@/knights/domain/entities/knight.entity';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SolidWeapon implements Weapon {
  @ApiProperty({ description: 'Weapon name' })
  name: string;

  @ApiProperty({ description: 'Weapon mod' })
  mod: number;

  @ApiProperty({ description: 'Weapon attr', type: String })
  attr: keyof Attributes;

  @ApiProperty({ description: 'Weapon equipped' })
  equipped: boolean;
}

class SolidAttributes implements Attributes {
  @ApiProperty({ description: 'Knight strength' })
  strength: number;

  @ApiProperty({ description: 'Knight dexterity' })
  dexterity: number;

  @ApiProperty({ description: 'Knight constitution' })
  constitution: number;

  @ApiProperty({ description: 'Knight intelligence' })
  intelligence: number;

  @ApiProperty({ description: 'Knight wisdom' })
  wisdom: number;

  @ApiProperty({ description: 'Knight charisma' })
  charisma: number;
}

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

  @ApiProperty({ description: 'Knight weapons', type: [SolidWeapon] })
  weapons: SolidWeapon[];

  @ApiProperty({ description: 'Knight attributes' })
  attributes: SolidAttributes;

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
