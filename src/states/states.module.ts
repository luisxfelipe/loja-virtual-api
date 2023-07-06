import { Module } from '@nestjs/common';

import { StatesService } from './states.service';

import { StatesController } from './states.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [StatesService],
})
export class StatesModule {}
