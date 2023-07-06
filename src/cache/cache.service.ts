import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCache<T>(key: string, functionRequest: () => Promise<T>) {
    const value: T = await this.cacheManager.get<T>(key);

    if (value) {
      return value;
    }

    const result = await functionRequest();

    await this.cacheManager.set(key, result);

    return result;
  }
}
