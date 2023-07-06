import { CreateAddressDto } from '../dto/create-address.dto';
import { addressMock } from './address.mock';

export const createAddressMock: CreateAddressDto = {
  cep: addressMock.cep,
  cityId: addressMock.cityId,
  complement: addressMock.complement,
  number: addressMock.number,
};
