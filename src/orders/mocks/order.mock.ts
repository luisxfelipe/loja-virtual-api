import { addressMock } from './../../addresses/mocks/address.mock';
import { Order } from '../entities/order.entity';
import { paymentMock } from './../../payments/mocks/payment.mock';
import { userMock } from './../../users/mocks/user.mock';

export const orderMock: Order = {
  id: 1,
  date: new Date(),
  addressId: addressMock.id,
  paymentId: paymentMock.id,
  userId: userMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
