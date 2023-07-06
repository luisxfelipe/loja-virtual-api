import { Cart } from '../entities/cart.entity';
import { ReturnCartProductDto } from './../../cart-products/dto/return-cart-product.dto';

export class ReturnCartDto {
  id: number;
  cartProduct?: ReturnCartProductDto[];

  constructor(cart: Cart) {
    this.id = cart.id;
    this.cartProduct = cart.cartProducts
      ? cart.cartProducts.map(
          (cartProduct) => new ReturnCartProductDto(cartProduct),
        )
      : undefined;
  }
}
