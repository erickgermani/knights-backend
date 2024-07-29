import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { KnightDataBuilder } from '../../../testing/helpers/knight-data-builder';
import { KnightEntityFactory, KnightProps } from '../../knight.entity';

describe('KnightEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a knight with invalid name', () => {
      let props: KnightProps = {
        ...KnightDataBuilder({}),
        name: null,
      };

      expect(() => KnightEntityFactory.create(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...KnightDataBuilder({}),
        name: '',
      };

      expect(() => KnightEntityFactory.create(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...KnightDataBuilder({}),
        name: 10 as any,
      };

      expect(() => KnightEntityFactory.create(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...KnightDataBuilder({}),
        name: 'a'.repeat(256),
      };

      expect(() => KnightEntityFactory.create(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should create a valid knight', () => {
      expect.assertions(0);

      const props: KnightProps = {
        ...KnightDataBuilder({}),
      };

      KnightEntityFactory.create(props);
    });
  });
});
