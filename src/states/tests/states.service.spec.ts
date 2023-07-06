import { Test, TestingModule } from '@nestjs/testing';

import { StatesService } from '../states.service';
import { Repository } from 'typeorm';
import { State } from '../entities/state.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { stateMock } from '../mocks/state.mock';

describe('StatesService', () => {
  let statesService: StatesService;
  let statesRepository: Repository<State>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatesService,
        {
          provide: getRepositoryToken(State),
          useValue: {
            find: jest.fn().mockResolvedValue([stateMock]),
          },
        },
      ],
    }).compile();

    statesService = module.get<StatesService>(StatesService);
    statesRepository = module.get<Repository<State>>(getRepositoryToken(State));
  });

  it('should be defined', () => {
    expect(statesService).toBeDefined();
    expect(statesRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of states', async () => {
      const states = await statesService.findAll();

      expect(states).toEqual([stateMock]);
    });

    it('should throw an error', async () => {
      jest.spyOn(statesRepository, 'find').mockRejectedValueOnce(new Error());

      await expect(statesService.findAll()).rejects.toThrowError();
    });
  });
});
