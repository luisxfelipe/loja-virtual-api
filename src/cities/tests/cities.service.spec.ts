import { Test, TestingModule } from '@nestjs/testing';

import { CitiesService } from '../cities.service';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheService } from '../../cache/cache.service';
import { cityMock } from '../mocks/city.mock';
import { NotFoundException } from '@nestjs/common';

describe('CitiesService', () => {
  let citiesService: CitiesService;
  let citiesRepository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(City),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(cityMock),
          },
        },
      ],
    }).compile();

    citiesService = module.get<CitiesService>(CitiesService);
    citiesRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(citiesService).toBeDefined();
    expect(citiesRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a city', async () => {
      const city = await citiesService.findOne(cityMock.id);

      expect(city).toEqual(cityMock);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(citiesRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      await expect(citiesService.findOne(cityMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByStateId', () => {
    it('should return a list of cities', async () => {
      const cities = await citiesService.findByStateId(cityMock.stateId);

      expect(cities).toEqual([cityMock]);
    });
  });
});
