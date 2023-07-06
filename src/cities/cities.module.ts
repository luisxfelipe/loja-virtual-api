import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { City } from './entities/city.entity';
import { StatesModule } from './../states/states.module';
import { CacheModule } from './../cache/cache.module';

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([City]), StatesModule],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
