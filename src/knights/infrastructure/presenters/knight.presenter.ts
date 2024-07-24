import ColletionPresenter from '@/shared/infrastructure/presenters/collection.presenter';
import { KnightOutput } from '@/knights/application/dtos/knight-output';
import { ListKnightsUseCase } from '@/knights/application/usecases/list-knights.usecase';
import { Attributes, Weapon } from '@/knights/domain/entities/knight.entity';
import { Transform } from 'class-transformer';

class KnightPresenter {
  id: string;

  name: string;

  nickname: string;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  birthday: Date;

  weapons: Weapon[];

  attributes: Attributes;

  keyAttribute: keyof Attributes;

  age: number;

  attack: number;

  experience: number;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @Transform(({ value }: { value: Date }) =>
    value ? value.toISOString() : value,
  )
  updatedAt: Date;

  constructor(output: KnightOutput) {
    this.id = output.id;
    this.name = output.name;
    this.nickname = output.nickname;
    this.birthday = output.birthday;
    this.weapons = output.weapons;
    this.attributes = output.attributes;
    this.keyAttribute = output.keyAttribute;
    this.age = output.age;
    this.attack = output.attack;
    this.experience = output.experience;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
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
