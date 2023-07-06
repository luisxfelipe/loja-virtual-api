import { Cart } from './../../carts/entities/cart.entity';
import { Product } from './../../products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cart_product')
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cart_id', nullable: false })
  cartId: number;

  @Column({ name: 'product_id', nullable: false })
  productId: number;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => Product, (product: Product) => product.cartProducts)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: Product;

  @ManyToOne(() => Cart, (cart: Cart) => cart.cartProducts)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: Cart;

  constructor(partial: Partial<CartProduct>) {
    Object.assign(this, partial);
  }
}
