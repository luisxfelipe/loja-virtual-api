import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatesModule } from './states/states.module';
import { CitiesModule } from './cities/cities.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { AddressesModule } from './addresses/addresses.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CartsModule } from './carts/carts.module';
import { CartProductsModule } from './cart-products/cart-products.module';
import { PaymentStatusModule } from './payment-status/payment-status.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';
import { OrderProductsModule } from './order-products/order-products.module';
import { CorreiosModule } from './correios/correios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: Boolean(
          Number(configService.get<boolean>('DB_AUTOLOAD_ENTITIES')),
        ),
        synchronize: Boolean(
          Number(configService.get<boolean>('DB_SYNCHRONIZE')),
        ),
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        migrationsRun: Boolean(
          Number(configService.get<boolean>('DB_MIGRATIONS_RUN')),
        ),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    StatesModule,
    CitiesModule,
    AddressesModule,
    CacheModule,
    AuthModule,
    JwtModule,
    AddressesModule,
    CategoriesModule,
    ProductsModule,
    CartsModule,
    CartProductsModule,
    PaymentStatusModule,
    PaymentsModule,
    OrdersModule,
    OrderProductsModule,
    CorreiosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
