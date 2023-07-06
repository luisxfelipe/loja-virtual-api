import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentsService } from './../../payments/payments.service';
import { CartsService } from './../../carts/carts.service';
import { ProductsService } from './../../products/products.service';
import { OrderProductsService } from './../../order-products/order-products.service';
import { orderMock } from '../mocks/order.mock';
import { userMock } from './../../users/mocks/user.mock';
import { NotFoundException } from '@nestjs/common';
import { orderProductMock } from './../../order-products/mocks/order-product.mock';
import { cartMock } from './../../carts/mocks/cart.mock';
import { productMock } from './../../products/mocks/product.mock';
import { cartProductMock } from './../../cart-products/mocks/cart-product.mock';
import { createOrderPixMock } from '../mocks/create-order,mock';
import { paymentMock } from './../../payments/mocks/payment.mock';
import { returnDeleteMock } from './../../mocks/return-delete.mock';

jest.useFakeTimers().setSystemTime(new Date('2023-07-01'));

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order>;
  let paymentsService: PaymentsService;
  let cartsService: CartsService;
  let productsService: ProductsService;
  let orderProductsService: OrderProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PaymentsService,
          useValue: {
            create: jest.fn().mockResolvedValue(paymentMock),
          },
        },
        {
          provide: CartsService,
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue({
              ...cartMock,
              cartProducts: [cartProductMock],
            }),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        {
          provide: OrderProductsService,
          useValue: {
            create: jest.fn().mockResolvedValue(orderProductMock),
            findQuantityProductByOrderId: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([productMock]),
          },
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            find: jest.fn().mockResolvedValue([orderMock]),
            save: jest.fn().mockResolvedValue(orderMock),
          },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    paymentsService = module.get<PaymentsService>(PaymentsService);
    cartsService = module.get<CartsService>(CartsService);
    productsService = module.get<ProductsService>(ProductsService);
    orderProductsService =
      module.get<OrderProductsService>(OrderProductsService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
    expect(ordersRepository).toBeDefined();
    expect(paymentsService).toBeDefined();
    expect(cartsService).toBeDefined();
    expect(productsService).toBeDefined();
    expect(orderProductsService).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should return an array of orders', async () => {
      const spy = jest.spyOn(ordersRepository, 'find');
      const orders = await ordersService.findByUserId(userMock.id);

      expect(orders).toEqual([orderMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        where: { userId: userMock.id },
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
          user: false,
        },
      });
    });

    it('should return an empty array', async () => {
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      const orders = await ordersService.findByUserId(userMock.id);

      expect(orders).toEqual([]);
    });

    it('should throw an NotFoundException', async () => {
      jest.spyOn(ordersRepository, 'find').mockRejectedValueOnce(new Error());

      await expect(ordersService.findByUserId(userMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createOrderProductsUsingCart', () => {
    it('should call createOrderProductsUsingCart by the number of products in the cart', async () => {
      const spy = jest.spyOn(orderProductsService, 'create');

      const createOrderProductsUsingCart =
        await ordersService.createOrderProductsUsingCart(
          {
            ...cartMock,
            cartProducts: [cartProductMock, cartProductMock],
          },
          orderMock.id,
          [productMock],
        );

      expect(createOrderProductsUsingCart).toEqual([
        orderProductMock,
        orderProductMock,
      ]);
      expect(spy.mock.calls.length).toEqual(2);
    });
  });

  describe('save', () => {
    it('should return an order', async () => {
      const spy = jest.spyOn(ordersRepository, 'save');

      const order = await ordersService.save(
        createOrderPixMock,
        userMock.id,
        paymentMock,
      );

      expect(order).toEqual(orderMock);
      expect(spy.mock.calls[0][0]).toEqual({
        addressId: createOrderPixMock.addressId,
        date: new Date(),
        paymentId: paymentMock.id,
        userId: userMock.id,
      });
    });

    it('should throw an exception', async () => {
      jest.spyOn(ordersRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(
        ordersService.save(createOrderPixMock, userMock.id, paymentMock),
      ).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should return an order', async () => {
      const spyCartsService = jest.spyOn(cartsService, 'findCartByUserId');
      const spyProductsService = jest.spyOn(productsService, 'findAll');
      const spyCartsServiceClear = jest.spyOn(cartsService, 'clearCart');
      const spyOrderProductsService = jest.spyOn(
        orderProductsService,
        'create',
      );
      const spyPaymentsService = jest.spyOn(paymentsService, 'create');
      const spySave = jest.spyOn(ordersRepository, 'save');

      const order = await ordersService.create(createOrderPixMock, userMock.id);

      expect(order).toEqual(orderMock);
      expect(spyCartsService.mock.calls.length).toEqual(1);
      expect(spyProductsService.mock.calls.length).toEqual(1);
      expect(spyPaymentsService.mock.calls.length).toEqual(1);
      expect(spySave.mock.calls.length).toEqual(1);
      expect(spyOrderProductsService.mock.calls.length).toEqual(1);
      expect(spyCartsServiceClear.mock.calls.length).toEqual(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const spy = jest.spyOn(ordersRepository, 'find');

      expect(await ordersService.findAll()).toEqual([orderMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        relations: {
          user: true,
        },
      });
    });

    it('should return an empty array', async () => {
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      expect(await ordersService.findAll()).toEqual([]);
    });

    it('should throw an NotFoundException', async () => {
      jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce([]);

      const orders = await ordersService.findByUserId(undefined, orderMock.id);

      expect(orders).toEqual([]);
    });
  });
});
