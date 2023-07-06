import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  Param,
  Patch,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { InsertProductCartDto } from './dto/insert-product-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';
import { UserDecorator } from './../decorators/user.decorator';
import { ReturnCartDto } from './dto/return-cart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
@ApiTags('carts')
@Roles(Role.User, Role.Admin, Role.Root)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  async create(
    @Body() insertProductCartDto: InsertProductCartDto,
    @UserDecorator('id') userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartsService.insertProduct(insertProductCartDto, userId),
    );
  }

  @Get()
  async findCartByUserId(
    @UserDecorator('id') userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartsService.findCartByUserId(userId, true),
    );
  }

  @Patch()
  async upadateProductInCart(
    @Body() updateCartDto: UpdateCartDto,
    @UserDecorator('id') userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartsService.upadateProductInCart(updateCartDto, userId),
    );
  }

  @Delete()
  async clearCart(@UserDecorator('id') userId: number): Promise<DeleteResult> {
    return this.cartsService.clearCart(userId);
  }

  @Delete('/product/:productId')
  async removeProduct(
    @UserDecorator('id') userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<DeleteResult> {
    return this.cartsService.removeProduct(productId, userId);
  }
}
