import { KnightEntity, KnightProps } from '../../knight.entity';
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
});
