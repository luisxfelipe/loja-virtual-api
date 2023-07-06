import { Module } from '@nestjs/common';
import { CartProductsService } from './cart-products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProduct } from './entities/cart-product.entity';
import { ProductsModule } from './../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartProduct]), ProductsModule],
  providers: [CartProductsService],
  exports: [CartProductsService],
})
export class CartProductsModule {}
