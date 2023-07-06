import { ChildEntity, Column } from 'typeorm';
import { Payment } from './payment.entity';
import { CreateOrderDto } from './../../orders/dto/create-order.dto';

@ChildEntity()
export class PaymentCreditCard extends Payment {
  @Column({ name: 'amount_payments', nullable: false })
  amountPayments: number;

  constructor(
    paymentStatusId: number,
    price: number,
    discount: number,
    finalPrice: number,
    createOrderDto: CreateOrderDto,
  ) {
    super(paymentStatusId, price, discount, finalPrice);
    this.amountPayments = createOrderDto?.amountPayments || 0;
  }
}
