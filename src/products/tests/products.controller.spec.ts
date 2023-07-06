import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { paginationProductMock, productMock } from '../mocks/product.mock';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { updateProductMock } from '../mocks/update-product.mock';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn().mockResolvedValue(productMock),
            findAll: jest.fn().mockResolvedValue([productMock]),
            findAllPage: jest.fn().mockResolvedValue(paginationProductMock),
            findOne: jest.fn().mockResolvedValue(productMock),
            update: jest.fn().mockResolvedValue(productMock),
            remove: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should return a product', async () => {
      const product = await productsController.create(productMock);

      expect(product).toEqual(productMock);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = await productsController.findAll();

      expect(products).toEqual([
        {
          id: productMock.id,
          name: productMock.name,
          price: productMock.price,
          image: productMock.image,
          weight: productMock.weight,
          length: productMock.length,
          height: productMock.height,
          width: productMock.width,
          diameter: productMock.diameter,
        },
      ]);
    });
  });

  describe('findAllPage', () => {
    it('should send a query to find products', async () => {
      const products = await productsController.findAllPage();

      expect(products).toEqual(paginationProductMock);
    });

    it('should return an array of products', async () => {
      const searchMock = 'test';
      const takeMock = 10;
      const pageMock = 1;

      const spy = jest.spyOn(productsService, 'findAllPage');

      await productsController.findAllPage(searchMock, takeMock, pageMock);

      expect(spy.mock.calls[0][0]).toEqual(searchMock);
      expect(spy.mock.calls[0][1]).toEqual(takeMock);
      expect(spy.mock.calls[0][2]).toEqual(pageMock);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const product = await productsController.findOne(productMock.id);

      expect(product).toEqual({
        id: productMock.id,
        name: productMock.name,
        price: productMock.price,
        image: productMock.image,
        weight: productMock.weight,
        length: productMock.length,
        height: productMock.height,
        width: productMock.width,
        diameter: productMock.diameter,
      });
    });
  });

  describe('update', () => {
    it('should return a product', async () => {
      const product = await productsController.update(
        productMock.id,
        updateProductMock,
      );

      expect(product).toEqual(productMock);
    });
  });

  describe('remove', () => {
    it('should return a delete result', async () => {
      const product = await productsController.remove(productMock.id);

      expect(product).toEqual(returnDeleteMock);
    });
  });
});
