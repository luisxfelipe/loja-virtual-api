import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PaymentsService } from './../payments/payments.service';
import { CartsService } from './../carts/carts.service';
import { ProductsService } from './../products/products.service';
import { Repository } from 'typeorm';
import { OrderProductsService } from './../order-products/order-products.service';
import { Cart } from './../carts/entities/cart.entity';
import { Product } from './../products/entities/product.entity';
import { OrderProduct } from './../order-products/entities/order-product.entity';
import { Payment } from './../payments/entities/payment.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly paymentsService: PaymentsService,
    private readonly cartsService: CartsService,
    private readonly productsService: ProductsService,
    private readonly orderProductsService: OrderProductsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const cart = await this.cartsService.findCartByUserId(userId, true);
    const products = await this.productsService.findAll(
      cart.cartProducts?.map((cartProduct) => cartProduct.productId),
    );
    const payment = await this.paymentsService.create(
      createOrderDto,
      products,
      cart,
    );
    const order = await this.save(createOrderDto, userId, payment);

    await this.createOrderProductsUsingCart(cart, order.id, products);

    await this.cartsService.clearCart(userId);

    return order;
  }

  async createOrderProductsUsingCart(
    cart: Cart,
    orderId: number,
    products: Product[],
  ): Promise<OrderProduct[]> {
    const orderproducts: OrderProduct[] = [];

    for (const cartProduct of cart.cartProducts) {
      const product = products.find(
        (product) => product.id === cartProduct.productId,
      );

      orderproducts.push(
        await this.orderProductsService.create(
          product.id,
          orderId,
          product.price,
          cartProduct.quantity,
        ),
      );
    }

    return orderproducts;
  }

  async findAll(): Promise<Order[]> {
    try {
      const orders = await this.orderRepository.find({
        relations: {
          user: true,
        },
      });

      const orderProducts =
        await this.orderProductsService.findQuantityProductByOrderId(
          orders.map((order) => order.id),
        );

      return orders.map((order) => {
        const orderProduct = orderProducts.find(
          (orderProduct) => orderProduct.order_id === order.id,
        );

        if (orderProduct) {
          return {
            ...order,
            quantityProducts: Number(orderProduct.total),
          };
        }
        return order;
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByUserId(userId?: number, id?: number): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { userId, id },
        relations: {
          address: {
            city: {
              state: true,
            },
          },
          payment: {
            paymentStatus: true,
          },
          orderProducts: {
            product: true,
          },
          user: id ? true : false,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async save(createOrderDto, userId, payment: Payment): Promise<Order> {
    return await this.orderRepository.save({
      addressId: createOrderDto.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });
  }
}
