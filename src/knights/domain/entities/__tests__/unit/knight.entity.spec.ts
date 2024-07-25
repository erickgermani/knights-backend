import {
  Attributes,
  KnightEntity,
  KnightProps,
  Weapon,
} from '../../knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';

describe('KnightEntity unit tests', () => {
  let props: KnightProps;
  let sut: KnightEntity;

  beforeEach(() => {
    KnightEntity.validate = jest.fn();

    props = KnightDataBuilder({});

    sut = new KnightEntity(props);
  });

  it('Constructor method', () => {
    expect(KnightEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('Getter of nickname field', () => {
    expect(sut.nickname).toBeDefined();
    expect(sut.nickname).toEqual(props.nickname);
    expect(typeof sut.nickname).toBe('string');
  });

  it('Getter of birthday field', () => {
    expect(sut.birthday).toBeDefined();
    expect(sut.birthday).toEqual(props.birthday);
    expect(sut.birthday).toBeInstanceOf(Date);
  });

  it('Getter of weapons field', () => {
    expect(sut.weapons).toBeDefined();
    expect(sut.weapons).toEqual(props.weapons);
    expect(sut.weapons.length).toBeGreaterThanOrEqual(1);
  });

  it('Getter of attributes field', () => {
    expect(sut.attributes).toBeDefined();
    expect(sut.attributes).toEqual(props.attributes);
  });

  it('Getter of keyAttribute field', () => {
    expect(sut.keyAttribute).toBeDefined();
    expect(sut.keyAttribute).toEqual(props.keyAttribute);
    expect(typeof sut.keyAttribute).toBe('string');
  });

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('Should update knight nickname', () => {
    sut.updateNickname('other nickname');

    expect(KnightEntity.validate).toHaveBeenCalled();
    expect(sut.props.nickname).toEqual('other nickname');
  });

  // it('Should calculate the correct age based on birthday', () => {
  //   const birthday = new Date('2000-07-20');

  //   const today = new Date();
  //   const expectedAge =
  //     today.getFullYear() -
  //     birthday.getFullYear() -
  //     (today.getMonth() < birthday.getMonth() ||
  //     (today.getMonth() === birthday.getMonth() &&
  //       today.getDate() < birthday.getDate())
  //       ? 1
  //       : 0);

  //   expect(sut['calculateAge'](birthday)).toBe(expectedAge);
  // });

  // it('Should return the currently equipped weapon', () => {
  //   const equippedWeapon: Weapon = {
  //     name: 'Sword of Dawn',
  //     mod: 5,
  //     attr: 'strength',
  //     equipped: true,
  //   };

  //   const weapons: Weapon[] = [
  //     equippedWeapon,
  //     {
  //       name: 'Shield of Night',
  //       mod: 3,
  //       attr: 'constitution',
  //       equipped: false,
  //     },
  //   ];

  //   sut = new KnightEntity(KnightDataBuilder({ weapons }));

  //   expect(sut['getEquippedWeapon']()).toEqual(equippedWeapon);
  // });

  // it('Should calculate the correct attack', () => {
  //   const weapons: Weapon[] = [
  //     { name: 'Sword', mod: 2, attr: 'strength', equipped: true },
  //     { name: 'Bow', mod: 1, attr: 'dexterity', equipped: false },
  //   ];

  //   const attributes: Attributes = {
  //     strength: 15,
  //     dexterity: 10,
  //     constitution: 12,
  //     intelligence: 8,
  //     wisdom: 14,
  //     charisma: 13,
  //   };

  //   sut = new KnightEntity(
  //     KnightDataBuilder({
  //       attributes,
  //       weapons,
  //       keyAttribute: 'dexterity',
  //     }),
  //   );

  //   const expectedAttack = KnightEntity.INITIAL_ATTACK + -1 + 2;

  //   expect(sut.attack).toBe(expectedAttack);
  // });
});
