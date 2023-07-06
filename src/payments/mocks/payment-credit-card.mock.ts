import { PaymentCreditCard } from '../entities/payment-credit-card.entity';
import { paymentMock } from './payment.mock';

export const paymentCreditCardMock: PaymentCreditCard = {
  ...paymentMock,
  amountPayments: 2,
};
