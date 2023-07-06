import { cityMock } from './../../cities/mocks/city.mock';
import { Address } from '../entities/address.entity';
import { userMock } from './../../users/mocks/user.mock';

export const addressMock: Address = {
  id: 1,
  number: '123',
  complement: 'Complemento Teste',
  cep: '12345678',
  cityId: cityMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: userMock.id,
};
