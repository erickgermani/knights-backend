import {
  KnightEntity,
  KnightEntityFactory,
} from '@/knights/domain/entities/knight.entity';
import { KnightDataBuilder } from '@/knights/domain/testing/helpers/knight-data-builder';
import { KnightOutputMapper } from '../../knight-output';

describe('KnightOutputMapper unit tests', () => {
  it('Should convert a knight in output', () => {
    const entity = KnightEntityFactory.create(KnightDataBuilder());

    const spyToJson = jest.spyOn(entity, 'toJSON');

    const sut = KnightOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
