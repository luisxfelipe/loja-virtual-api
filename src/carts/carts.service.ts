import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertProductCartDto } from './dto/insert-product-cart.dto';
import { CartProductsService } from './../cart-products/cart-products.service';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly cartProductsService: CartProductsService,
  ) {}

  async clearCart(userId: number): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId);

    await this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw: [],
      affected: 1,
    };
  }

  async create(userId: number): Promise<Cart> {
    return this.cartRepository.save({
      active: true,
      userId,
    });
  }

  async findCartByUserId(userId: number, isRelations?: boolean): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: {
        userId,
        active: true,
      },
      ...(isRelations && { relations: ['cartProducts'] }),
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async insertProduct(
    insertProductCartDto: InsertProductCartDto,
    userId: number,
  ): Promise<Cart> {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.create(userId);
    });

    await this.cartProductsService.insertProduct(insertProductCartDto, cart);

    return cart;
  }

  async upadateProductInCart(
    updateCartDto: UpdateCartDto,
    userId: number,
  ): Promise<Cart> {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.create(userId);
    });

    await this.cartProductsService.update(updateCartDto, cart);

    return cart;
  }

  async removeProduct(
    productId: number,
    userId: number,
  ): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId);

    return this.cartProductsService.remove(productId, cart.id);
  }
}
