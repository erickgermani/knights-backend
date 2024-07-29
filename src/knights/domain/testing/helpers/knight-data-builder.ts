import { faker } from '@faker-js/faker';
import { Attributes, KnightProps, Weapon } from '../../entities/knight.entity';

type Props = {
  name?: string;
  nickname?: string;
  birthday?: Date;
  weapons?: Array<Weapon>;
  attributes?: Attributes;
  keyAttribute?: keyof Attributes;
  heroifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

const attributeKeys = [
  'charisma',
  'constitution',
  'dexterity',
  'intelligence',
  'strength',
  'wisdom',
];

function getRandomAttributeKey() {
  const attributeKey = attributeKeys[
    faker.number.int({
      min: 0,
      max: Object.keys(attributeKeys).length - 1,
    })
  ] as keyof Attributes;

  return attributeKey;
}

export function KnightDataBuilder(props: Props = {}): KnightProps {
  return {
    name: props.name ?? faker.person.fullName(),
    nickname: props.nickname ?? faker.internet.userName(),
    birthday:
      props.birthday ?? faker.date.birthdate({ min: 1, max: 80, mode: 'age' }),
    weapons: props.weapons ?? [
      {
        attr: getRandomAttributeKey(),
        name: faker.commerce.productName(),
        mod: 3,
        equipped: true,
      },
    ],
    attributes: props.attributes ?? {
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
    keyAttribute: props.keyAttribute ?? getRandomAttributeKey(),
    heroifiedAt: props.heroifiedAt,
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt,
  };
}
