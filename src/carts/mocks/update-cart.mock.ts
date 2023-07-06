import { productMock } from './../../products/mocks/product.mock';
import { UpdateCartDto } from '../dto/update-cart.dto';

export const updateCartMock: UpdateCartDto = {
  productId: productMock.id,
  quantity: 2,
};
