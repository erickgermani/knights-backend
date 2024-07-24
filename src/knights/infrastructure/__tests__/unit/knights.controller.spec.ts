import { KnightOutput } from '@/knights/application/dtos/knight-output';
import { KnightsController } from '../../knights.controller';
import { CreateKnightUseCase } from '@/knights/application/usecases/create-knight.usecase';
import { CreateDto } from '../../dtos/create.dto';
import KnightPresenter from '../../presenters/knight.presenter';

describe('KnightsController', () => {
  let sut: KnightsController;
  let id: string;
  let props: KnightOutput;

  beforeEach(async () => {
    sut = new KnightsController();
    id = '60af9245e1f49f1b9a7c94a4';

    const today = new Date();

    props = {
      id,
      name: 'John Doe',
      nickname: 'john.knight',
      birthday: new Date(),
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
      keyAttribute: 'constitution',
      age: 42,
      attack: 43,
      experience: 19700,
      createdAt: today,
      updatedAt: today,
    };
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should create a knight', async () => {
    const output: CreateKnightUseCase.Output = props;

    const mockCreateKnightUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    sut['createKnightUseCase'] = mockCreateKnightUseCase as any;

    const input: CreateDto = {
      name: 'John Doe',
      nickname: 'john.knight',
      birthday: new Date(),
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
      keyAttribute: 'constitution',
    };

    const presenter = await sut.create(input);

    expect(presenter).toBeInstanceOf(KnightPresenter);
    expect(presenter).toStrictEqual(new KnightPresenter(output));
    expect(mockCreateKnightUseCase.execute).toHaveBeenCalledWith(input);
  });
});
