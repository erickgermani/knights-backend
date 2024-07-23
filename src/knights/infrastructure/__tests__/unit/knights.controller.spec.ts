import { KnightsController } from '../../knights.controller';

describe('KnightsController', () => {
  let sut: KnightsController;

  beforeEach(async () => {
    sut = new KnightsController();
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });
});
