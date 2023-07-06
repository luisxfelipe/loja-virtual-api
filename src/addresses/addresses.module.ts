import { Module } from '@nestjs/common';

import { AddressesService } from './addresses.service';

import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UsersModule } from './../users/users.module';
import { CitiesModule } from './../cities/cities.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UsersModule, CitiesModule],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
