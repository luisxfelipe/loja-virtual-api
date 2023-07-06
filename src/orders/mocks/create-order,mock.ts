import { addressMock } from './../../addresses/mocks/address.mock';
import { CreateOrderDto } from '../dto/create-order.dto';
import { paymentPixMock } from './../../payments/mocks/payment-pix.mock';
import { paymentCreditCardMock } from './../../payments/mocks/payment-credit-card.mock';

export const createOrderPixMock: CreateOrderDto = {
  addressId: addressMock.id,
  codePix: paymentPixMock.code,
  datePayment: '2023-07-01',
};

export const createOrderCreditCardMock: CreateOrderDto = {
  addressId: addressMock.id,
  amountPayments: paymentCreditCardMock.amountPayments,
};
