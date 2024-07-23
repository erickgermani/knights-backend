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
  keyAttribute: keyof Attributes;
  age?: number;
  attack?: number;
  experience?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class KnightEntity extends Entity<KnightProps> {
  private INITIAL_ATTACK = 10;

  private ATTACK_MODIFIER = {
    '0-8': -2,
    '9-10': -1,
    '1-12': 0,
    '13-15': 1,
    '16-18': 2,
    '19-20': 3,
  };

  constructor(
    public readonly props: KnightProps,
    id?: string,
  ) {
    KnightEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.age = this.props.age ?? this.calculateAge(props.birthday);
    this.props.attack = this.props.attack ?? this.calculateAttack();
    this.props.experience = this.props.experience ?? this.calculateExperience();
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

  get age() {
    return this.props.age;
  }

  get attack() {
    return this.props.attack;
  }

  get experience() {
    return this.props.experience;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  updateNickname(value: string) {
    KnightEntity.validate({ ...this.props, nickname: value });

    this.nickname = value;
  }

  private calculateAge(birthday: Date) {
    const today = new Date();

    let years = today.getFullYear() - birthday.getFullYear();

    const currentMonth = today.getMonth();
    const initialMonth = birthday.getMonth();

    const currentDay = today.getDate();
    const initialDay = birthday.getDate();

    if (
      currentMonth < initialMonth ||
      (currentMonth === initialMonth && currentDay < initialDay)
    )
      years -= 1;

    return years;
  }

  private getEquippedWeapon() {
    const equippedWeapon = this.props.weapons.find((weapon) => weapon.equipped);

    return equippedWeapon;
  }

  private getAttributeMod() {
    const attributeValue =
      this.attributes[this.keyAttribute as keyof Attributes];

    for (const range in this.ATTACK_MODIFIER) {
      const [min, max] = range.split('-').map(Number);

      if (attributeValue >= min && attributeValue <= max)
        return this.ATTACK_MODIFIER[range];
    }
  }

  private calculateAttack() {
    const attributeMod = this.getAttributeMod();
    const weaponMod = this.getEquippedWeapon().mod;

    const attack = this.INITIAL_ATTACK + attributeMod + weaponMod;

    return attack;
  }

  private calculateExperience() {
    if (this.props.age < 7) return 0;

    const experience = Math.floor((this.props.age - 7) * Math.pow(22, 1.45));

    return experience;
  }

  static validate(props: KnightProps) {
    const validator = KnightValidatorFactory.create();
    const isValid = validator.validate(props);

    if (!isValid) throw new EntityValidationError(validator.errors);
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      age: this.age,
      weapons: this.weapons.length,
      keyAttribute: this.keyAttribute,
      attack: this.attack,
      experience: this.experience,
      createdAt: this.createdAt,
    };
  }
}
