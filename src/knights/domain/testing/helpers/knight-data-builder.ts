import { faker } from '@faker-js/faker';
import { Attributes, KnightProps, Weapon } from '../../entities/knight.entity';

type Props = {
  name?: string;
  nickname?: string;
  birthday?: Date;
  weapons?: Array<Weapon>;
  attributes?: Attributes;
  attributeKey?: keyof Attributes;
  createdAt?: Date;
};

export function KnightDataBuilder(props: Props = {}): KnightProps {
  return {
    name: props.name ?? faker.person.fullName(),
    nickname: props.nickname ?? faker.internet.userName(),
    birthday: props.birthday ?? new Date(),
    weapons: props.weapons ?? [
      {
        attr: 'strength',
        name: 'sword',
        mod: 3,
        equipped: true,
      },
    ],
    attributes: {
      charisma: 0,
      constitution: 0,
      dexterity: 0,
      intelligence: 0,
      strength: 0,
      wisdom: 0,
    },
    keyAttribute: 'strength',
    createdAt: props.createdAt ?? new Date(),
  };
}
