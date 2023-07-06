import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { ReturnGroupOrderDto } from './dto/return-order-group.dto';

@Injectable()
export class OrderProductsService {
  constructor(
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
  ) {}

  create(
    productId: number,
    orderId: number,
    price: number,
    quantity: number,
  ): Promise<OrderProduct> {
    return this.orderProductRepository.save({
      productId,
      orderId,
      price,
      quantity,
    });
  }

  async findQuantityProductByOrderId(
    orderId: number[],
  ): Promise<ReturnGroupOrderDto[]> {
    return this.orderProductRepository
      .createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...orderId)', { orderId })
      .groupBy('order_product.order_id')
      .getRawMany();
  }
}
