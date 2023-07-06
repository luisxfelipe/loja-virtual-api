import { Injectable } from '@nestjs/common';

import { CreateAddressDto } from './dto/create-address.dto';

import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UsersService } from './../users/users.service';
import { CitiesService } from './../cities/cities.service';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
    private readonly usersService: UsersService,
    private readonly citiesService: CitiesService,
  ) {}

  async create(createAddressDto: CreateAddressDto, userId: number) {
    await this.usersService.findOne(userId);
    await this.citiesService.findOne(createAddressDto.cityId);

    return this.addressesRepository.save(
      this.addressesRepository.create({
        ...createAddressDto,
        user: { id: userId },
      }),
    );
  }

  async findAllByUserId(userId: number): Promise<Address[]> {
    await this.usersService.findOne(userId);

    return this.addressesRepository.find({
      where: {
        userId,
      },
      relations: {
        city: {
          state: true,
        },
      },
    });
  }
}
