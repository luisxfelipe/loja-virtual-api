import { userMock } from './../../users/mocks/user.mock';
import { Cart } from '../entities/cart.entity';

export const cartMock: Cart = {
  id: 1,
  userId: userMock.id,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
