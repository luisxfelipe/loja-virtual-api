import { OrderProduct } from './../../order-products/entities/order-product.entity';
import { CartProduct } from './../../cart-products/entities/cart-product.entity';
import { Category } from './../../categories/entities/category.entity';
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

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'decimal', nullable: false, precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: false })
  image: string;

  @Column({ name: 'category_id', nullable: false })
  categoryId: number;

  @Column({ type: 'decimal', nullable: false, precision: 10, scale: 2 })
  weight: number;

  @Column({ nullable: false })
  length: number;

  @Column({ nullable: false })
  height: number;

  @Column({ nullable: false })
  width: number;

  @Column({ nullable: false })
  diameter: number;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => Category, (category: Category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: Category;

  @OneToMany(
    () => CartProduct,
    (cartProduct: CartProduct) => cartProduct.product,
  )
  cartProducts?: CartProduct[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  ordersProduct?: OrderProduct[];

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
