import { PaymentPix } from '../entities/payment-pix.entity';
import { paymentMock } from './payment.mock';

export const paymentPixMock: PaymentPix = {
  ...paymentMock,
  code: 'ahsgfsd',
  datePayment: new Date('2023-07-01'),
};
