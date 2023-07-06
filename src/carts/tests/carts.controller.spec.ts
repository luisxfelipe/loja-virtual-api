import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from '../carts.controller';
import { CartsService } from '../carts.service';
import { cartMock } from '../mocks/cart.mock';
import { updateCartMock } from '../mocks/update-cart.mock';
import { insertProductCartMock } from '../mocks/insert-product-cart.mock';
import { userMock } from './../../users/mocks/user.mock';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { productMock } from './../../products/mocks/product.mock';

describe('CartsController', () => {
  let cartsController: CartsController;
  let cartsService: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        {
          provide: CartsService,
          useValue: {
            insertProduct: jest.fn().mockResolvedValue(cartMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartMock),
            upadateProductInCart: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    cartsController = module.get<CartsController>(CartsController);
    cartsService = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(cartsController).toBeDefined();
    expect(cartsService).toBeDefined();
  });

  describe('insertProduct', () => {
    it('should be return a cart', async () => {
      const cart = await cartsController.create(
        insertProductCartMock,
        userMock.id,
      );
      expect(cart).toEqual({
        id: cartMock.id,
      });
    });
  });

  describe('findCartByUserId', () => {
    it('should be return a cart', async () => {
      const cart = await cartsController.findCartByUserId(userMock.id);
      expect(cart).toEqual({
        id: cartMock.id,
      });
    });
  });

  describe('upadateProductInCart', () => {
    it('should be return a cart', async () => {
      const cart = await cartsController.upadateProductInCart(
        updateCartMock,
        userMock.id,
      );

      expect(cart).toEqual({
        id: cartMock.id,
      });
    });
  });

  describe('clearCart', () => {
    it('should be return a delete result', async () => {
      const cart = await cartsController.clearCart(userMock.id);

      expect(cart).toEqual(returnDeleteMock);
    });
  });
});
