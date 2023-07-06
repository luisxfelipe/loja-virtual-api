import { orderMock } from './../../orders/mocks/order.mock';
import { OrderProduct } from '../entities/order-product.entity';
import { productMock } from './../../products/mocks/product.mock';

export const orderProductMock: OrderProduct = {
  id: 1,
  productId: productMock.id,
  quantity: 1,
  price: productMock.price,
  orderId: orderMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
