import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { orderMock } from '../mocks/order.mock';
import { createOrderPixMock } from '../mocks/create-order,mock';
import { userMock } from './../../users/mocks/user.mock';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn().mockResolvedValue(orderMock),
            findByUserId: jest.fn().mockResolvedValue([orderMock]),
            findAll: jest.fn().mockResolvedValue([orderMock]),
          },
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
    expect(ordersService).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      expect(
        await ordersController.create(createOrderPixMock, userMock.id),
      ).toEqual(orderMock);
    });
  });

  describe('findByUserId', () => {
    it('should find orders by user id', async () => {
      expect(await ordersController.findByUserId(userMock.id)).toEqual([
        orderMock,
      ]);
    });
  });

  describe('findAll', () => {
    it('should find all orders', async () => {
      const spy = jest.spyOn(ordersService, 'findAll');

      expect(await ordersController.findAll()).toEqual([
        {
          id: orderMock.id,
          date: orderMock.date.toString(),
          userId: orderMock.userId,
          addressId: orderMock.addressId,
          paymentId: orderMock.paymentId,
        },
      ]);

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should find an order by id', async () => {
      const spy = jest.spyOn(ordersService, 'findByUserId');

      expect(await ordersController.findOne(orderMock.id)).toEqual({
        id: orderMock.id,
        date: orderMock.date.toString(),
        userId: orderMock.userId,
        addressId: orderMock.addressId,
        paymentId: orderMock.paymentId,
      });

      expect(spy).toBeCalledTimes(1);
    });
  });
});
