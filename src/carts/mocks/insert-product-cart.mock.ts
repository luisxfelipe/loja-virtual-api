import { productMock } from './../../products/mocks/product.mock';
import { InsertProductCartDto } from '../dto/insert-product-cart.dto';

export const insertProductCartMock: InsertProductCartDto = {
  productId: productMock.id,
  quantity: 1,
};
