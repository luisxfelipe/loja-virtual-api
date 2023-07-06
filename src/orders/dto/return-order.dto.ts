import { ReturnUserDto } from './../../users/dto/return-user.dto';
import { Order } from '../entities/order.entity';
import { ReturnAddressDto } from './../../addresses/dto/return-address.dto';
import { ReturnPaymentDto } from './../../payments/dto/return-payment.dto';
import { OrderProduct } from './../../order-products/entities/order-product.entity';
import { ReturnOrderProductDto } from './../../order-products/dto/return-order-product.dto';

export class ReturnOrderDto {
  id: number;
  date: string;
  userId: number;
  addressId: number;
  paymentId: number;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDto;
  orderProducts?: ReturnOrderProductDto[];
  quantityProducts?: number;

  constructor(order: Order) {
    this.id = order.id;
    this.date = order.date.toString();
    this.userId = order.userId;
    this.addressId = order.addressId;
    this.paymentId = order.paymentId;
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDto(order.address)
      : undefined;
    this.payment = order.payment
      ? new ReturnPaymentDto(order.payment)
      : undefined;
    this.orderProducts = order.orderProducts
      ? order.orderProducts.map(
          (orderProduct: OrderProduct) =>
            new ReturnOrderProductDto(orderProduct),
        )
      : undefined;
    this.quantityProducts = order.quantityProducts;
  }
}
