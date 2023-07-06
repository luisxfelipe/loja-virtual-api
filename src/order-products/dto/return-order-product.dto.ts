import { OrderProduct } from '../entities/order-product.entity';
import { ReturnOrderDto } from './../../orders/dto/return-order.dto';
import { ReturnProductDto } from './../../products/dto/return-product.dto';

export class ReturnOrderProductDto {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  order?: ReturnOrderDto;
  product?: ReturnProductDto;

  constructor(orderProduct: OrderProduct) {
    this.id = orderProduct.id;
    this.orderId = orderProduct.orderId;
    this.productId = orderProduct.productId;
    this.quantity = orderProduct.quantity;
    this.price = orderProduct.price;
    this.order = orderProduct.order
      ? new ReturnOrderDto(orderProduct.order)
      : null;
    this.product = orderProduct.product
      ? new ReturnProductDto(orderProduct.product)
      : null;
  }
}
