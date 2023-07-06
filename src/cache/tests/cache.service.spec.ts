import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../cache.service';
import { userMock } from './../../users/mocks/user.mock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

describe('CacheService', () => {
  let cacheService: CacheService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => userMock,
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    cacheService = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(cacheService).toBeDefined();
    expect(cacheManager).toBeDefined();
  });

  it('should return data in cache', async () => {
    const user = await cacheService.getCache('user', () => null);

    expect(user).toEqual(userMock);
  });

  it('should return data in function', async () => {
    const result = { test: 'tes' };
    jest.spyOn(cacheManager, 'get').mockResolvedValue(undefined);

    const user = await cacheService.getCache('user', () =>
      Promise.resolve(result),
    );

    expect(user).toEqual(result);
  });
});
