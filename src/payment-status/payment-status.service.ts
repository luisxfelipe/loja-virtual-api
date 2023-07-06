import { Injectable } from '@nestjs/common';
import { CreatePaymentStatusDto } from './dto/create-payment-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentStatusService {
  create(CreatePaymentStatusDto: CreatePaymentStatusDto) {
    return 'This action adds a new paymentsStatus';
  }

  findAll() {
    return `This action returns all paymentsStatus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentsStatus`;
  }

  update(id: number, UpdatePaymentStatusDto: UpdatePaymentStatusDto) {
    return `This action updates a #${id} paymentsStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentsStatus`;
  }
}
