import { Entity } from '../../entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('Should set props and id', () => {
    const props = {
      prop1: 'value1',
      prop2: 7,
    };

    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity._id).not.toBeNull();
    expect(entity._id).toMatch(/^[0-9a-fA-F]{24}$/);
  });

  it('Should accept a valid ObjectId', () => {
    const props = {
      prop1: 'value1',
      prop2: 7,
    };

    const id = '60af9245e1f49f1b9a7c94a4';

    const entity = new StubEntity(props, id);

    expect(entity._id).toMatch(/^[0-9a-fA-F]{24}$/);
    expect(entity._id).toBe(id);
  });

  it('Should convert a entity to a Javascript Object', () => {
    const props = {
      prop1: 'value1',
      prop2: 7,
    };

    const id = '60af9245e1f49f1b9a7c94a4';

    const entity = new StubEntity(props, id);

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    });
  });
});
