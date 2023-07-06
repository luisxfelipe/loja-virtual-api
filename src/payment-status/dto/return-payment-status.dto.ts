import { PaymentStatus } from '../entities/payment-status.entity';

export class ReturnPaymentStatusDto {
  id: number;
  status: string;

  constructor(paymentStatus: PaymentStatus) {
    this.id = paymentStatus.id;
    this.status = paymentStatus.status;
  }
}
