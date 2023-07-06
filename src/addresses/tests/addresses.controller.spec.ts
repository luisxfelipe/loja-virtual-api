import { Test, TestingModule } from '@nestjs/testing';

import { AddressesController } from '../addresses.controller';

import { AddressesService } from '../addresses.service';
import { createAddressMock } from '../mocks/create-address.mock';
import { userMock } from './../../users/mocks/user.mock';
import { addressMock } from '../mocks/address.mock';

describe('AddressesController', () => {
  let addressesController: AddressesController;
  let addressesService: AddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],

      providers: [
        {
          provide: AddressesService,
          useValue: {
            create: jest.fn().mockResolvedValue(addressMock),
            findAllByUserId: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    addressesController = module.get<AddressesController>(AddressesController);
    addressesService = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(addressesController).toBeDefined();
    expect(addressesService).toBeDefined();
  });

  describe('create', () => {
    it('should create an address', async () => {
      const address = await addressesController.create(
        createAddressMock,
        userMock.id,
      );

      expect(address).toEqual(addressMock);
    });
  });

  describe('findAllByUserId', () => {
    it('should return an array of addresses', async () => {
      const addresses = await addressesController.findAllByUserId(userMock.id);

      expect(addresses).toEqual([
        {
          id: addressMock.id,
          complement: addressMock.complement,
          number: addressMock.number,
          cep: addressMock.cep,
          city: addressMock.city,
        },
      ]);
    });
  });
});
