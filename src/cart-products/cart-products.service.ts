import { Injectable, NotFoundException } from '@nestjs/common';
import { CartProduct } from './entities/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertProductCartDto } from './../carts/dto/insert-product-cart.dto';
import { Cart } from './../carts/entities/cart.entity';
import { ProductsService } from './../products/products.service';
import { UpdateCartDto } from './../carts/dto/update-cart.dto';

@Injectable()
export class CartProductsService {
  constructor(
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    insertProductCartDto: InsertProductCartDto,
    cartId: number,
  ): Promise<CartProduct> {
    return await this.cartProductRepository.save({
      ...insertProductCartDto,
      cartId,
    });
  }

  async insertProduct(
    insertProductCartDto: InsertProductCartDto,
    cart: Cart,
  ): Promise<CartProduct> {
    await this.productsService.findOne(insertProductCartDto.productId);

    const cartProduct = await this.verifyProductInCart(
      insertProductCartDto.productId,
      cart.id,
    ).catch(() => undefined);

    if (!cartProduct) {
      return this.create(insertProductCartDto, cart.id);
    }

    return this.cartProductRepository.save({
      ...cartProduct,
      quantity: cartProduct.quantity + insertProductCartDto.quantity,
    });
  }

  async update(updateCartDto: UpdateCartDto, cart: Cart): Promise<CartProduct> {
    await this.productsService.findOne(updateCartDto.productId);

    const cartProduct = await this.verifyProductInCart(
      updateCartDto.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...cartProduct,
      quantity: updateCartDto.quantity,
    });
  }

  async remove(productId: number, cartId: number): Promise<DeleteResult> {
    return this.cartProductRepository.delete({
      productId,
      cartId,
    });
  }

  async deleteProductCart(
    productId: number,
    cartId: number,
  ): Promise<DeleteResult> {
    return this.cartProductRepository.delete({ productId, cartId });
  }

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProduct> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException('Product not found in cart');
    }

    return cartProduct;
  }
}
