import { PaymentStatus } from './../../payment-status/entities/payment-status.entity';
import { Payment } from '../entities/payment.entity';
import { ReturnPaymentStatusDto } from './../../payment-status/dto/return-payment-status.dto';

export class ReturnPaymentDto {
  id: number;
  paymentStatusId: number;
  price: number;
  discount: number;
  finalPrice: number;
  type: string;
  paymentStatus?: ReturnPaymentStatusDto;

  constructor(payment: Payment) {
    this.id = payment.id;
    this.paymentStatusId = payment.paymentStatusId;
    this.price = payment.price;
    this.discount = payment.discount;
    this.finalPrice = payment.finalPrice;
    this.type = payment.type;
    this.paymentStatus = payment.paymentStatus
      ? new ReturnPaymentStatusDto(payment.paymentStatus)
      : undefined;
  }
}
