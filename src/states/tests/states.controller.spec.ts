import { Test, TestingModule } from '@nestjs/testing';

import { StatesController } from '../states.controller';

import { StatesService } from '../states.service';
import { stateMock } from '../mocks/state.mock';

describe('StatesController', () => {
  let statesController: StatesController;
  let statesService: StatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatesController],
      providers: [
        {
          provide: StatesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([stateMock]),
          },
        },
      ],
    }).compile();

    statesController = module.get<StatesController>(StatesController);
    statesService = module.get<StatesService>(StatesService);
  });

  it('should be defined', () => {
    expect(statesController).toBeDefined();
    expect(statesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of states', async () => {
      const states = await statesController.findAll();

      expect(states).toEqual([stateMock]);
    });
  });
});
