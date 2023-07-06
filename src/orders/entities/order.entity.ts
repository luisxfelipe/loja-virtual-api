import { Address } from './../../addresses/entities/address.entity';
import { OrderProduct } from './../../order-products/entities/order-product.entity';
import { Payment } from './../../payments/entities/payment.entity';
import { User } from './../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'address_id', nullable: false })
  addressId: number;

  @Column({ name: 'date', nullable: false })
  date: Date;

  @Column({ name: 'payment_id', nullable: false })
  paymentId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => Address, (address) => address.orders)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: Address;

  @ManyToOne(() => Payment, (payment) => payment.orders)
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payment?: Payment;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts?: OrderProduct[];

  quantityProducts?: number;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
