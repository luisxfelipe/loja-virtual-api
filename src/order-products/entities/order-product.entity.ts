import { Order } from './../../orders/entities/order.entity';
import { Product } from './../../products/entities/product.entity';
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

@Entity('order_product')
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', nullable: true })
  orderId: number;

  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'quantity', nullable: true })
  quantity: number;

  @Column({
    type: 'decimal',
    name: 'price',
    nullable: true,
    precision: 10,
    scale: 2,
  })
  price: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order?: Order;

  @ManyToOne(() => Product, (product) => product.ordersProduct)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: Product;

  constructor(partial: Partial<OrderProduct>) {
    Object.assign(this, partial);
  }
}
