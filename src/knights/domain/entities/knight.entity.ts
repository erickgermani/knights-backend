import { Entity } from '@/shared/domain/entities/entity';
import { KnightValidatorFactory } from '../validators/knight.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type Attributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

export type Weapon = {
  name: string;
  mod: number;
  attr: keyof Attributes;
  equipped: boolean;
};

export type KnightProps = {
  name: string;
  nickname: string;
  birthday: Date;
  weapons: Array<Weapon>;
  attributes: Attributes;
  keyAttribute: keyof Attributes;
  heroifiedAt?: Date;
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
    this.props.heroifiedAt = this.props.heroifiedAt ?? null;
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = this.props.updatedAt ?? null;
  }

  get name() {
    return this.props.name;
  }

  get nickname() {
    return this.props.nickname;
  }

  get birthday() {
    return this.props.birthday;
  }

  private set nickname(value: string) {
    this.props.nickname = value;
  }

  get weapons() {
    return this.props.weapons;
  }

  get attributes() {
    return this.props.attributes;
  }

  get keyAttribute() {
    return this.props.keyAttribute;
  }

  get heroifiedAt() {
    return this.props.heroifiedAt;
  }

  private set heroifiedAt(value: Date) {
    this.props.heroifiedAt = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  updateNickname(value: string) {
    KnightEntity.validate({ ...this.props, nickname: value });

    this.nickname = value;
    this.updatedAt = new Date();
  }

  heroify() {
    const now = new Date();

    this.heroifiedAt = now;
    this.updatedAt = now;
  }

  static validate(props: KnightProps) {
    const validator = KnightValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}

export class KnightEntityFactory {
  static create(props: KnightProps): KnightEntity {
    return new KnightEntity(props);
  }
}
