import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as CacheModuleNest } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModuleNest.registerAsync({
      useFactory: () => ({
        ttl: 900000000,
      }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
