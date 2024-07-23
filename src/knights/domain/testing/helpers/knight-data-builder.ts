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
      charisma: faker.number.int({
        min: 0,
        max: 20,
      }),
      constitution: faker.number.int({
        min: 0,
        max: 20,
      }),
      dexterity: faker.number.int({
        min: 0,
        max: 20,
      }),
      intelligence: faker.number.int({
        min: 0,
        max: 20,
      }),
      strength: faker.number.int({
        min: 0,
        max: 20,
      }),
      wisdom: faker.number.int({
        min: 0,
        max: 20,
      }),
    },
    keyAttribute: 'strength',
    createdAt: props.createdAt ?? new Date(),
  };
}
