import { Order } from './../../orders/entities/order.entity';
import { City } from './../../cities/entities/city.entity';
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

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'complement', nullable: true })
  complement: string;

  @Column({ name: 'number', nullable: false })
  number: string;

  @Column({ name: 'cep', nullable: false })
  cep: string;

  @Column({ name: 'city_id', nullable: false })
  cityId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne(() => City, (city) => city.addresses)
  @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
  city?: City;

  @OneToMany(() => Order, (order) => order.address)
  orders?: Order[];

  constructor(partial: Partial<Address>) {
    Object.assign(this, partial);
  }
}
