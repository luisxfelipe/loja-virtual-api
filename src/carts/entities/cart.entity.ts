import { CartProduct } from './../../cart-products/entities/cart-product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'active', nullable: false, default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @OneToMany(() => CartProduct, (cartProduct: CartProduct) => cartProduct.cart)
  cartProducts?: CartProduct[];

  constructor(partial: Partial<Cart>) {
    Object.assign(this, partial);
  }
}
