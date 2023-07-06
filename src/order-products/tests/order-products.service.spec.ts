import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductsService } from '../order-products.service';
import { Repository } from 'typeorm';
import { OrderProduct } from '../entities/order-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { orderProductMock } from '../mocks/order-product.mock';
import { productMock } from './../../products/mocks/product.mock';
import { orderMock } from './../../orders/mocks/order.mock';
import { cartProductMock } from './../../cart-products/mocks/cart-product.mock';

describe('OrderProductsService', () => {
  let orderProductsService: OrderProductsService;
  let orderProductsRepository: Repository<OrderProduct>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductsService,
        {
          provide: getRepositoryToken(OrderProduct),
          useValue: {
            save: jest.fn().mockResolvedValue(orderProductMock),
          },
        },
      ],
    }).compile();

    orderProductsService =
      module.get<OrderProductsService>(OrderProductsService);
    orderProductsRepository = module.get<Repository<OrderProduct>>(
      getRepositoryToken(OrderProduct),
    );
  });

  it('should be defined', () => {
    expect(orderProductsService).toBeDefined();
    expect(orderProductsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order product', async () => {
      const spy = jest.spyOn(orderProductsRepository, 'save');
      const orderProduct = await orderProductsService.create(
        productMock.id,
        orderMock.id,
        orderProductMock.price,
        orderProductMock.quantity,
      );

      expect(orderProduct).toEqual(orderProductMock);
      expect(spy.mock.calls[0][0]).toEqual({
        productId: productMock.id,
        orderId: orderMock.id,
        price: orderProductMock.price,
        quantity: orderProductMock.quantity,
      });
    });

    it('should throw an error', async () => {
      jest
        .spyOn(orderProductsRepository, 'save')
        .mockRejectedValueOnce(new Error());

      await expect(
        orderProductsService.create(
          productMock.id,
          orderMock.id,
          orderProductMock.price,
          orderProductMock.quantity,
        ),
      ).rejects.toThrowError();
    });
  });
});
