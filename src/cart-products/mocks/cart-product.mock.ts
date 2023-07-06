import { productMock } from './../../products/mocks/product.mock';
import { CartProduct } from '../entities/cart-product.entity';
import { cartMock } from './../../carts/mocks/cart.mock';

export const cartProductMock: CartProduct = {
  id: 1,
  quantity: 2,
  cartId: cartMock.id,
  productId: productMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
