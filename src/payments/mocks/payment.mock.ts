import { PaymentType } from './../../payment-status/enums/payment-type.enum';
import { Payment } from '../entities/payment.entity';

export const paymentMock: Payment = {
  id: 1,
  price: 89.9,
  discount: 0,
  finalPrice: 89.9,
  paymentStatusId: PaymentType.Done,
  createdAt: new Date(),
  updatedAt: new Date(),
  type: 'asd',
};
