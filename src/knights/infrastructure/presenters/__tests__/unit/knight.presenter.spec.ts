import { instanceToPlain } from 'class-transformer';
import KnightPresenter, {
  KnightCollectionPresenter,
} from '../../knight.presenter';
import PaginationPresenter from '@/shared/infrastructure/presenters/pagination.presenter';

describe('KnightPresenter unit tests', () => {
  let sut: KnightPresenter;

  const today = new Date();

  const props = {
    id: '60af9245e1f49f1b9a7c94a4',
    name: 'test name',
    nickname: 'test nickname',
    birthday: today,
    weapons: [
      {
        attr: 'charisma' as any,
        name: 'Ergonomic Fresh Pants',
        mod: 3,
        equipped: true,
      },
    ],
    attributes: {
      charisma: 17,
      constitution: 17,
      dexterity: 19,
      intelligence: 14,
      strength: 18,
      wisdom: 19,
    },
    keyAttribute: 'dexterity' as any,
    age: 10,
    attack: 15,
    experience: 5000,
    createdAt: today,
    updatedAt: today,
  };

  beforeEach(() => {
    sut = new KnightPresenter(props);
  });

  describe('constructor', () => {
    it('Should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.nickname).toEqual(props.nickname);
      expect(sut.birthday).toEqual(props.birthday);
      expect(sut.weapons).toEqual(props.weapons);
      expect(sut.attributes).toEqual(props.attributes);
      expect(sut.keyAttribute).toEqual(props.keyAttribute);
      expect(sut.age).toEqual(props.age);
      expect(sut.attack).toEqual(props.attack);
      expect(sut.experience).toEqual(props.experience);
      expect(sut.createdAt).toEqual(props.createdAt);
    });
  });

  it('Should presenter data', () => {
    const output = instanceToPlain(sut);

    expect(output).toEqual({
      id: '60af9245e1f49f1b9a7c94a4',
      name: 'test name',
      nickname: 'test nickname',
      birthday: today.toISOString(),
      weapons: [
        {
          attr: 'charisma',
          name: 'Ergonomic Fresh Pants',
          mod: 3,
          equipped: true,
        },
      ],
      attributes: {
        charisma: 17,
        constitution: 17,
        dexterity: 19,
        intelligence: 14,
        strength: 18,
        wisdom: 19,
      },
      keyAttribute: 'dexterity',
      age: 10,
      attack: 15,
      experience: 5000,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    });
  });
});

describe('KnightCollectionPresenter unit tests', () => {
  const today = new Date();

  const props = {
    id: '60af9245e1f49f1b9a7c94a4',
    name: 'test name',
    nickname: 'test nickname',
    birthday: today,
    weapons: [
      {
        attr: 'charisma' as any,
        name: 'Ergonomic Fresh Pants',
        mod: 3,
        equipped: true,
      },
    ],
    attributes: {
      charisma: 17,
      constitution: 17,
      dexterity: 19,
      intelligence: 14,
      strength: 18,
      wisdom: 19,
    },
    keyAttribute: 'dexterity' as any,
    age: 10,
    attack: 15,
    experience: 5000,
    createdAt: today,
    updatedAt: today,
  };

  describe('constructor', () => {
    it('Should set values', () => {
      const sut = new KnightCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });

      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(sut.data).toEqual([new KnightPresenter(props)]);
    });
  });

  it('Should presenter data', () => {
    let sut = new KnightCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    });

    let output = instanceToPlain(sut);

    expect(output).toStrictEqual({
      data: [
        {
          id: '60af9245e1f49f1b9a7c94a4',
          name: 'test name',
          nickname: 'test nickname',
          birthday: today.toISOString(),
          weapons: [
            {
              attr: 'charisma',
              name: 'Ergonomic Fresh Pants',
              mod: 3,
              equipped: true,
            },
          ],
          attributes: {
            charisma: 17,
            constitution: 17,
            dexterity: 19,
            intelligence: 14,
            strength: 18,
            wisdom: 19,
          },
          keyAttribute: 'dexterity',
          age: 10,
          attack: 15,
          experience: 5000,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        },
      ],
      meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
    });

    sut = new KnightCollectionPresenter({
      items: [props],
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '1' as any,
      total: '1' as any,
    });

    output = instanceToPlain(sut);

    expect(output).toStrictEqual({
      data: [
        {
          id: '60af9245e1f49f1b9a7c94a4',
          name: 'test name',
          nickname: 'test nickname',
          birthday: today.toISOString(),
          weapons: [
            {
              attr: 'charisma',
              name: 'Ergonomic Fresh Pants',
              mod: 3,
              equipped: true,
            },
          ],
          attributes: {
            charisma: 17,
            constitution: 17,
            dexterity: 19,
            intelligence: 14,
            strength: 18,
            wisdom: 19,
          },
          keyAttribute: 'dexterity',
          age: 10,
          attack: 15,
          experience: 5000,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        },
      ],
      meta: { currentPage: 1, perPage: 2, lastPage: 1, total: 1 },
    });
  });
});
