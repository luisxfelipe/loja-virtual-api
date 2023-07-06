import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from '../carts.service';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductsService } from './../../cart-products/cart-products.service';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { cartMock } from '../mocks/cart.mock';
import { userMock } from './../../users/mocks/user.mock';
import { NotFoundException } from '@nestjs/common';
import { insertProductCartMock } from '../mocks/insert-product-cart.mock';
import { productMock } from './../../products/mocks/product.mock';
import { updateCartMock } from '../mocks/update-cart.mock';

describe('CartsService', () => {
  let cartsService: CartsService;
  let cartRepository: Repository<Cart>;
  let cartProductsService: CartProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        {
          provide: CartProductsService,
          useValue: {
            insertProduct: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn().mockResolvedValue(returnDeleteMock),
            update: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            save: jest.fn().mockResolvedValue(cartMock),
            findOne: jest.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    cartsService = module.get<CartsService>(CartsService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartProductsService = module.get<CartProductsService>(CartProductsService);
  });

  it('should be defined', () => {
    expect(cartsService).toBeDefined();
    expect(cartRepository).toBeDefined();
    expect(cartProductsService).toBeDefined();
  });

  describe('clearCart', () => {
    it('should return delete result', async () => {
      const spy = jest.spyOn(cartRepository, 'save');

      const result = await cartsService.clearCart(userMock.id);

      expect(result).toEqual(returnDeleteMock);
      expect(spy.mock.calls[0][0]).toEqual({
        ...cartMock,
        active: false,
      });
    });

    it('should return error when cart not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      await expect(cartsService.clearCart(userMock.id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findCartByUserId', () => {
    it('should return cart (without relations)', async () => {
      const spy = jest.spyOn(cartRepository, 'findOne');

      const cart = await cartsService.findCartByUserId(userMock.id);

      expect(cart).toEqual(cartMock);
      expect(spy.mock.calls[0][0].relations).toEqual(undefined);
    });

    it('should return cart (with relations)', async () => {
      const spy = jest.spyOn(cartRepository, 'findOne');

      const cart = await cartsService.findCartByUserId(userMock.id, true);

      expect(cart).toEqual(cartMock);
      expect(spy.mock.calls[0][0].relations).toEqual(['cartProducts']);
    });

    it('should return NotFoundException when cart not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        cartsService.findCartByUserId(userMock.id),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('should return send info in save (create)', async () => {
      const spy = jest.spyOn(cartRepository, 'save');

      const cart = await cartsService.create(userMock.id);

      expect(cart).toEqual(cartMock);
      expect(spy.mock.calls[0][0]).toEqual({
        active: true,
        userId: userMock.id,
      });
    });
  });

  describe('insertProduct', () => {
    it('should return cart in cart not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockRejectedValueOnce(undefined);
      const spy = jest.spyOn(cartRepository, 'save');
      const spyCartProductService = jest.spyOn(
        cartProductsService,
        'insertProduct',
      );

      const cart = await cartsService.insertProduct(
        insertProductCartMock,
        userMock.id,
      );

      expect(cart).toEqual(cartMock);
      expect(spy.mock.calls.length).toEqual(1);
      expect(spyCartProductService.mock.calls.length).toEqual(1);
    });

    it('should return cart in cart found', async () => {
      const spy = jest.spyOn(cartRepository, 'save');
      const spyCartProductService = jest.spyOn(
        cartProductsService,
        'insertProduct',
      );

      const cart = await cartsService.insertProduct(
        insertProductCartMock,
        userMock.id,
      );

      expect(cart).toEqual(cartMock);
      expect(spy.mock.calls.length).toEqual(0);
      expect(spyCartProductService.mock.calls.length).toEqual(1);
    });
  });

  describe('removeProduct', () => {
    it('should return delete result', async () => {
      const spy = jest.spyOn(cartProductsService, 'remove');
      const deleteResult = await cartsService.removeProduct(
        productMock.id,
        userMock.id,
      );

      expect(deleteResult).toEqual(returnDeleteMock);
      expect(spy.mock.calls.length).toEqual(1);
    });

    it('should return NotFoundException when cart not found', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);
      const spy = jest.spyOn(cartProductsService, 'remove');

      await expect(
        cartsService.removeProduct(productMock.id, userMock.id),
      ).rejects.toThrowError(NotFoundException);
      expect(spy.mock.calls.length).toEqual(0);
    });
  });

  describe('updateProduct', () => {
    it('should return cartProduct', async () => {
      const spyCartProductsService = jest.spyOn(cartProductsService, 'update');
      const cartProduct = await cartsService.upadateProductInCart(
        updateCartMock,
        userMock.id,
      );
      const spySave = jest.spyOn(cartRepository, 'save');

      expect(cartProduct).toEqual(cartMock);
      expect(spyCartProductsService.mock.calls.length).toEqual(1);
      expect(spySave.mock.calls.length).toEqual(0);
    });

    it('should return cart', async () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      const spySave = jest.spyOn(cartRepository, 'save');

      const cart = await cartsService.upadateProductInCart(
        updateCartMock,
        userMock.id,
      );

      expect(cart).toEqual(cartMock);
      expect(spySave.mock.calls.length).toEqual(1);
    });
  });
});
