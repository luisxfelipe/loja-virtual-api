import { Test, TestingModule } from '@nestjs/testing';

import { AddressesService } from '../addresses.service';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { addressMock } from '../mocks/address.mock';
import { UsersService } from './../../users/users.service';
import { userMock } from './../../users/mocks/user.mock';
import { CitiesService } from './../../cities/cities.service';
import { cityMock } from './../../cities/mocks/city.mock';
import { createAddressMock } from '../mocks/create-address.mock';
import { NotFoundException } from '@nestjs/common';

describe('AddressesService', () => {
  let addressesService: AddressesService;
  let usersService: UsersService;
  let citiesService: CitiesService;
  let addressesRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(userMock),
          },
        },
        {
          provide: CitiesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: getRepositoryToken(Address),
          useValue: {
            create: jest.fn().mockReturnValue(addressMock),
            save: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue(new Array<Address>(addressMock)),
          },
        },
      ],
    }).compile();

    addressesService = module.get<AddressesService>(AddressesService);
    usersService = module.get<UsersService>(UsersService);
    citiesService = module.get<CitiesService>(CitiesService);
    addressesRepository = module.get<Repository<Address>>(
      getRepositoryToken(Address),
    );
  });

  it('should be defined', () => {
    expect(addressesService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(citiesService).toBeDefined();
    expect(addressesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return an error when user does not exist', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      expect(
        addressesService.create(createAddressMock, userMock.id),
      ).rejects.toThrowError();
    });

    it('should return an error when city does not exist', async () => {
      jest.spyOn(citiesService, 'findOne').mockRejectedValueOnce(new Error());

      expect(
        addressesService.create(createAddressMock, userMock.id),
      ).rejects.toThrowError();
    });

    it('should create a new address', async () => {
      const address = await addressesService.create(
        createAddressMock,
        userMock.id,
      );

      expect(address).toEqual(addressMock);
    });
  });

  describe('findByUser', () => {
    /*
    it('should return an error when user does not exist', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      expect(addressesService.findByUser(userMock.id)).rejects.toThrowError();
    });*/

    it('should return an empty array when user does not have addresses', async () => {
      jest
        .spyOn(addressesRepository, 'find')
        .mockResolvedValueOnce(new Array<Address>());

      const addresses = await addressesService.findAllByUserId(userMock.id);

      expect(addresses).toEqual(new Array<Address>());
    });

    it('should return an array of addresses', async () => {
      const addresses = await addressesService.findAllByUserId(userMock.id);

      expect(addresses).toEqual(new Array<Address>(addressMock));
    });
  });
});
