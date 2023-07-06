import { Test, TestingModule } from '@nestjs/testing';
import { CartProductsService } from '../cart-products.service';
import { ProductsService } from './../../products/products.service';
import { Repository } from 'typeorm';
import { CartProduct } from '../entities/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from './../../products/mocks/product.mock';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { cartMock } from './../../carts/mocks/cart.mock';
import { insertProductCartMock } from './../../carts/mocks/insert-product-cart.mock';
import { cartProductMock } from '../mocks/cart-product.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from './../../carts/mocks/update-cart.mock';

describe('CartProductsService', () => {
  let cartProductsService: CartProductsService;
  let productsService: ProductsService;
  let cartProductRepository: Repository<CartProduct>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(productMock),
          },
        },
        {
          provide: getRepositoryToken(CartProduct),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            save: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        CartProductsService,
      ],
    }).compile();

    cartProductsService = module.get<CartProductsService>(CartProductsService);
    productsService = module.get<ProductsService>(ProductsService);
    cartProductRepository = module.get<Repository<CartProduct>>(
      getRepositoryToken(CartProduct),
    );
  });

  it('should be defined', () => {
    expect(cartProductsService).toBeDefined();
    expect(productsService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  describe('delete product from cart', () => {
    it('should return Delete Result after delete product', async () => {
      const deleteResult = await cartProductsService.remove(
        productMock.id,
        cartMock.id,
      );

      expect(deleteResult).toEqual(returnDeleteMock);
    });

    it('should return error in exception delete', async () => {
      jest
        .spyOn(cartProductRepository, 'delete')
        .mockRejectedValueOnce(new Error());

      expect(
        cartProductsService.remove(productMock.id, cartMock.id),
      ).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should return CartProduct after create', async () => {
      const cartProduct = await cartProductsService.create(
        insertProductCartMock,
        cartMock.id,
      );

      expect(cartProduct).toEqual(cartProductMock);
    });

    it('should return error  in exception create', async () => {
      jest
        .spyOn(cartProductRepository, 'save')
        .mockRejectedValueOnce(new Error());

      await expect(
        cartProductsService.create(insertProductCartMock, cartMock.id),
      ).rejects.toThrowError();
    });
  });

  describe('verify product in cart', () => {
    it('should return cartProduct if product is in cart', async () => {
      const cartProduct = await cartProductsService.verifyProductInCart(
        productMock.id,
        cartMock.id,
      );

      expect(cartProduct).toEqual(cartProductMock);
    });

    it('should return error if product is not in cart', async () => {
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        cartProductsService.verifyProductInCart(productMock.id, cartMock.id),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return error in exception verifyProductInCart', async () => {
      jest
        .spyOn(cartProductRepository, 'findOne')
        .mockRejectedValueOnce(new Error());

      await expect(
        cartProductsService.verifyProductInCart(productMock.id, cartMock.id),
      ).rejects.toThrowError(Error);
    });
  });

  describe('insert product', () => {
    it('should return cartProduct if product not in cart', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

      const cartProduct = await cartProductsService.insertProduct(
        insertProductCartMock,
        cartMock,
      );

      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0].quantity).toEqual(
        insertProductCartMock.quantity,
      );
    });

    it('should return error in exception insertProductInCart', async () => {
      jest
        .spyOn(productsService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      expect(
        cartProductsService.insertProduct(insertProductCartMock, cartMock),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return cartProduct if product not in cart', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

      const cartProduct = await cartProductsService.insertProduct(
        insertProductCartMock,
        cartMock,
      );

      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0].quantity).toEqual(
        insertProductCartMock.quantity,
      );
    });

    it('should return cart product if not exist cart', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');

      const cartProduct = await cartProductsService.insertProduct(
        insertProductCartMock,
        cartMock,
      );

      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0]).toEqual({
        ...cartProductMock,
        quantity: cartProductMock.quantity + insertProductCartMock.quantity,
      });
    });
  });

  describe('update', () => {
    it('should return error in exception updateProductInCart', async () => {
      jest
        .spyOn(productsService, 'findOne')
        .mockRejectedValueOnce(new NotFoundException());

      expect(
        cartProductsService.update(updateCartMock, cartMock),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should return cart product if not exist cart (updateProductInCart)', async () => {
      const spy = jest.spyOn(cartProductRepository, 'save');

      const cartProduct = await cartProductsService.update(
        updateCartMock,
        cartMock,
      );

      expect(cartProduct).toEqual(cartProductMock);
      expect(spy.mock.calls[0][0].quantity).toEqual(updateCartMock.quantity);
    });

    it('should return cart product if not exist cart (updateProductInCart)', async () => {
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

      expect(
        cartProductsService.update(updateCartMock, cartMock),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
