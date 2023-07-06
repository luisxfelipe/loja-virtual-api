import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PaymentsModule } from './../payments/payments.module';
import { OrderProductsModule } from './../order-products/order-products.module';
import { CartsModule } from './../carts/carts.module';
import { ProductsModule } from './../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    PaymentsModule,
    OrderProductsModule,
    CartsModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
