import { Order } from './../../orders/entities/order.entity';
import { PaymentStatus } from './../../payment-status/entities/payment-status.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'payment_status_id', nullable: false })
  paymentStatusId: number;

  @Column({
    type: 'decimal',
    name: 'price',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    name: 'discount',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  discount: number;

  @Column({
    type: 'decimal',
    name: 'final_price',
    nullable: false,
    precision: 10,
    scale: 2,
  })
  finalPrice: number;

  @Column({ name: 'type', nullable: false })
  type: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => PaymentStatus, (paymentStatus) => paymentStatus.payments)
  @JoinColumn({ name: 'payment_status_id', referencedColumnName: 'id' })
  paymentStatus?: PaymentStatus;

  @OneToMany(() => Order, (order) => order.payment)
  orders?: Order[];

  constructor(
    paymentStatusId: number,
    price: number,
    discount: number,
    finalPrice: number,
  ) {
    this.paymentStatusId = paymentStatusId;
    this.price = price;
    this.discount = discount;
    this.finalPrice = finalPrice;
  }
}
