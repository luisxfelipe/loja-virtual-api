import { Test, TestingModule } from '@nestjs/testing';

import { CitiesController } from '../cities.controller';

import { CitiesService } from '../cities.service';
import { cityMock } from '../mocks/city.mock';

describe('CitiesController', () => {
  let citiesController: CitiesController;
  let citiesService: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],

      providers: [
        {
          provide: CitiesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([cityMock]),
          },
        },
      ],
    }).compile();

    citiesController = module.get<CitiesController>(CitiesController);
    citiesService = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(citiesController).toBeDefined();
    expect(citiesService).toBeDefined();
  });

  describe('findAll', () => {
    it('should be able to return an array of cities', async () => {
      const cities = await citiesController.findAll();

      expect(cities).toEqual([cityMock]);
    });
  });
});
