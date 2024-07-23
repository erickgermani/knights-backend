import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import {
  KnightRules,
  KnightValidator,
  KnightValidatorFactory,
} from '../../knight.validator';
import { KnightProps } from '@/knights/domain/entities/knight.entity';

let sut: KnightValidator;
let props: KnightProps;

describe('KnightValidator unit tests', () => {
  beforeEach(() => {
    sut = KnightValidatorFactory.create();
    props = KnightDataBuilder();
  });

  it('Valid case for knight rules', () => {
    const isValid = sut.validate(props);

    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new KnightRules(props));
  });

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null);

    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, name: '' });

    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

    isValid = sut.validate({ ...props, name: 5 as any });

    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, name: 'a'.repeat(256) });

    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for nickname field', () => {
    let isValid = sut.validate(null);

    expect(isValid).toBeFalsy();
    expect(sut.errors['nickname']).toStrictEqual([
      'nickname should not be empty',
      'nickname must be a string',
      'nickname must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, nickname: '' });

    expect(isValid).toBeFalsy();
    expect(sut.errors['nickname']).toStrictEqual([
      'nickname should not be empty',
    ]);

    isValid = sut.validate({ ...props, nickname: 5 as any });

    expect(isValid).toBeFalsy();
    expect(sut.errors['nickname']).toStrictEqual([
      'nickname must be a string',
      'nickname must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, nickname: 'a'.repeat(256) });

    expect(isValid).toBeFalsy();
    expect(sut.errors['nickname']).toStrictEqual([
      'nickname must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for birthday field', () => {
    let isValid = sut.validate({ ...props, birthday: 10 as any });

    expect(isValid).toBeFalsy();
    expect(sut.errors['birthday']).toStrictEqual([
      'birthday must be a Date instance',
    ]);

    isValid = sut.validate({ ...props, birthday: '2023' as any });

    expect(isValid).toBeFalsy();
    expect(sut.errors['birthday']).toStrictEqual([
      'birthday must be a Date instance',
    ]);
  });

  describe('Invalidation cases for weapons array', () => {
    it('Should throw an error when weapons are not an object or an empty object', () => {
      let isValid = sut.validate({ ...props, weapons: 10 as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['weapons']).toStrictEqual([
        'weapons should not be empty',
        'weapons must be an array',
      ]);

      isValid = sut.validate({ ...props, weapons: [] });

      expect(isValid).toBeFalsy();
      expect(sut.errors['weapons']).toStrictEqual([
        'weapons should not be empty',
      ]);
    });

    // TODO fazer esse teste passar
    it.skip('Should throw an error when weapons items are invalid', () => {
      let isValid = sut.validate({
        ...props,
        weapons: [{} as any],
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['weapons']).toStrictEqual([
        'each value in weapons must be an instance of Weapon',
      ]);

      isValid = sut.validate({
        ...props,
        weapons: [
          {
            attr: [] as any,
            equipped: true,
            mod: 0,
            name: 'name',
          },
        ],
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['weapons']).toStrictEqual([
        'each value in weapons must be an instance of Weapon',
      ]);
    });
  });

  describe('Invalidation cases for attributes object', () => {
    it('Should throw an error when attributes is not an object or an empty object', () => {
      let isValid = sut.validate({ ...props, attributes: 10 as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['attributes']).toStrictEqual([
        'attributes must be a non-empty object',
        'attributes must be an object',
      ]);

      isValid = sut.validate({ ...props, attributes: {} as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['attributes']).toStrictEqual([
        'attributes must be a non-empty object',
      ]);
    });

    // TODO fazer esse teste passar
    it.skip('Should throw an error when attributes props are invalid', () => {
      let isValid = sut.validate({
        ...props,
        attributes: {
          ...props.attributes,
          charisma: '' as any,
        },
      });

      expect(isValid).toBeFalsy();
      expect(sut.errors['attributes']).toStrictEqual([
        'attributes must be a non-empty object',
        'attributes must be an object',
        'nested property attributes must be either object or array',
      ]);

      isValid = sut.validate({ ...props, attributes: {} as any });

      expect(isValid).toBeFalsy();
      expect(sut.errors['attributes']).toStrictEqual([
        'attributes must be a non-empty object',
      ]);
    });
  });

  it('Invalidation cases for createdAt field', () => {
    let isValid = sut.validate({ ...props, createdAt: 10 as any });

    expect(isValid).toBeFalsy();
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ]);

    isValid = sut.validate({ ...props, createdAt: '2023' as any });

    expect(isValid).toBeFalsy();
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ]);
  });
});
