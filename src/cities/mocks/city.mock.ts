import { stateMock } from './../../states/mocks/state.mock';
import { City } from '../entities/city.entity';

export const cityMock: City = {
  id: 1,
  name: 'São Paulo',
  stateId: stateMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
