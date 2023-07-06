import { ReturnCartDto } from './../../carts/dto/return-cart.dto';
import { ReturnProductDto } from './../../products/dto/return-product.dto';
import { CartProduct } from '../entities/cart-product.entity';

export class ReturnCartProductDto {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product?: ReturnProductDto;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProduct) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.productId = cartProduct.productId;
    this.quantity = cartProduct.quantity;
    this.product = cartProduct.product
      ? new ReturnProductDto(cartProduct.product)
      : undefined;
    this.cart = cartProduct.cart
      ? new ReturnCartDto(cartProduct.cart)
      : undefined;
  }
}
