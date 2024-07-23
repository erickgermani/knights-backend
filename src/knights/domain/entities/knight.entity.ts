import { Entity } from '@/shared/domain/entities/entity';
import { KnightValidatorFactory } from '../validators/knight.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type Weapon = {
  name: string;
  mod: number;
  attr: string;
  equipped: boolean;
};

export type Attributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type KnightProps = {
  name: string;
  nickname: string;
  birthday: Date;
  weapons: Array<Weapon>;
  attributes: Attributes;
  keyAttribute: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class KnightEntity extends Entity<KnightProps> {
  constructor(
    public readonly props: KnightProps,
    id?: string,
  ) {
    KnightEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get nickname() {
    return this.props.nickname;
  }

  private set nickname(value: string) {
    this.props.nickname = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static validate(props: KnightProps) {
    const validator = KnightValidatorFactory.create();
    const isValid = validator.validate(props);

    console.log('validator.errors :>> ', validator.errors);

    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
