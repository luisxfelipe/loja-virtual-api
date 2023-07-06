import { Payment } from '../../payments/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_status')
export class PaymentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status', nullable: false })
  status: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @OneToMany(() => Payment, (payment) => payment.paymentStatus)
  payments?: Payment[];

  constructor(partial: Partial<PaymentStatus>) {
    Object.assign(this, partial);
  }
}
