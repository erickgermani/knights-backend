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
  // static INITIAL_ATTACK = 10;

  // static ATTACK_MODIFIER = {
  //   '0-8': -2,
  //   '9-10': -1,
  //   '1-12': 0,
  //   '13-15': 1,
  //   '16-18': 2,
  //   '19-20': 3,
  // };

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
  }

  heroify() {
    this.heroifiedAt = new Date();
  }

  // private calculateAge(birthday: Date) {
  //   const today = new Date();

  //   let years = today.getFullYear() - birthday.getFullYear();

  //   const currentMonth = today.getMonth();
  //   const initialMonth = birthday.getMonth();

  //   const currentDay = today.getDate();
  //   const initialDay = birthday.getDate();

  //   if (
  //     currentMonth < initialMonth ||
  //     (currentMonth === initialMonth && currentDay < initialDay)
  //   )
  //     years -= 1;

  //   return years;
  // }

  // private getEquippedWeapon() {
  //   const equippedWeapon = this.props.weapons.find((weapon) => weapon.equipped);

  //   return equippedWeapon;
  // }

  // private getAttributeMod() {
  //   const attributeValue =
  //     this.attributes[this.keyAttribute as keyof Attributes];

  //   for (const range in KnightEntity.ATTACK_MODIFIER) {
  //     const [min, max] = range.split('-').map(Number);

  //     if (attributeValue >= min && attributeValue <= max)
  //       return KnightEntity.ATTACK_MODIFIER[range];
  //   }
  // }

  // private calculateAttack() {
  //   const attributeMod = this.getAttributeMod();
  //   const weaponMod = this.getEquippedWeapon().mod;

  //   const attack = KnightEntity.INITIAL_ATTACK + attributeMod + weaponMod;

  //   return attack;
  // }

  // private calculateExperience() {
  //   if (this.age < 7) return 0;

  //   const experience = Math.floor((this.age - 7) * Math.pow(22, 1.45));

  //   return experience;
  // }

  static validate(props: KnightProps) {
    const validator = KnightValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
