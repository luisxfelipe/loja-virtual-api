import { ChildEntity, Column } from 'typeorm';
import { Payment } from './payment.entity';
import { CreateOrderDto } from './../../orders/dto/create-order.dto';

@ChildEntity()
export class PaymentPix extends Payment {
  @Column({ name: 'code', nullable: false })
  code: string;

  @Column({ name: 'date_payment', nullable: false })
  datePayment: Date;

  constructor(
    paymentStatusId: number,
    price: number,
    discount: number,
    finalPrice: number,
    createOrderDto: CreateOrderDto,
  ) {
    super(paymentStatusId, price, discount, finalPrice);
    this.code = createOrderDto?.codePix || '';
    this.datePayment = new Date(createOrderDto?.datePayment || '');
  }
}
