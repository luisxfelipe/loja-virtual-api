import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ILike, In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginationProductMock, productMock } from '../mocks/product.mock';
import { createProductMock } from '../mocks/create-product.mock';
import { CategoriesService } from './../../categories/categories.service';
import { categoryMock } from './../../categories/mocks/category.mock';
import { NotFoundException } from '@nestjs/common';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { updateProductMock } from '../mocks/update-product.mock';
import { CorreiosService } from './../../correios/correios.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Product>;

  let categoriesService: CategoriesService;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: CorreiosService,
          useValue: {
            calculatePriceDelivery: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(categoryMock),
          },
        },
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            findAndCount: jest.fn().mockResolvedValue([[productMock], 1]),
            findOneOrFail: jest.fn().mockResolvedValue(productMock),
            create: jest.fn().mockReturnValue(productMock),
            save: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );

    categoriesService = module.get<CategoriesService>(CategoriesService);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(productsRepository).toBeDefined();
    expect(categoriesService).toBeDefined();
    expect(correiosService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = await productsService.findAll();

      expect(products).toEqual([productMock]);
    });

    it('should return an array of products with relations', async () => {
      const spy = jest.spyOn(productsRepository, 'find');
      const products = await productsService.findAll([], true);

      expect(products).toEqual([productMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        relations: {
          category: true,
        },
      });
    });

    it('should return an array of products with relations and productIds', async () => {
      const spy = jest.spyOn(productsRepository, 'find');
      const products = await productsService.findAll([1], true);

      expect(products).toEqual([productMock]);
      expect(spy.mock.calls[0][0]).toEqual({
        where: {
          id: In([1]),
        },
        relations: {
          category: true,
        },
      });
    });

    it('should return an empty array', async () => {
      jest.spyOn(productsRepository, 'find').mockResolvedValueOnce([]);

      const products = await productsService.findAll();

      expect(products).toEqual([]);
    });
  });

  describe('findAllPaginated', () => {
    it('should return an array of products', async () => {
      const spy = jest.spyOn(productsRepository, 'findAndCount');
      const products = await productsService.findAllPage();

      expect(products.data).toEqual([productMock]);
      expect(products.meta).toEqual({
        itemsPerPage: 10,
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
      });
      expect(spy.mock.calls[0][0]).toEqual({
        take: 10,
        skip: 0,
      });
    });

    it('should return an array of products paginated send take and skip', async () => {
      const takeMock = 10;
      const pageMock = 1;
      const productsPagination = await productsService.findAllPage(
        undefined,
        takeMock,
        pageMock,
      );

      expect(productsPagination.data).toEqual([productMock]);
      expect(productsPagination.meta).toEqual({
        itemsPerPage: takeMock,
        totalItems: 1,
        currentPage: pageMock,
        totalPages: 1,
      });
    });

    it('should return an array of products paginated send search', async () => {
      const searchMock = 'search';
      const spy = jest.spyOn(productsRepository, 'findAndCount');
      await productsService.findAllPage(searchMock);

      expect(spy.mock.calls[0][0].where).toEqual({
        name: ILike(`%${searchMock}%`),
      });
    });
  });

  describe('findOne', () => {
    it('should return a product without relations', async () => {
      const spy = jest.spyOn(productsRepository, 'findOneOrFail');
      const product = await productsService.findOne(productMock.id);

      expect(product).toEqual(productMock);
      expect(spy.mock.calls[0][0]).toEqual({
        where: {
          id: productMock.id,
        },
      });
    });

    it('should return a product with relations', async () => {
      const spy = jest.spyOn(productsRepository, 'findOneOrFail');
      const product = await productsService.findOne(productMock.id, true);

      expect(product).toEqual(productMock);
      expect(spy.mock.calls[0][0]).toEqual({
        where: {
          id: productMock.id,
        },
        relations: ['category'],
      });
    });

    it('should throw an error', async () => {
      jest
        .spyOn(productsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      await expect(productsService.findOne(productMock.id)).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = await productsService.create(createProductMock);

      expect(product).toEqual(productMock);
    });

    it('should throw an error', async () => {
      jest.spyOn(productsRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(productsService.create(productMock)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should return an error when product does not exist', async () => {
      jest
        .spyOn(productsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      await expect(
        productsService.update(productMock.id, updateProductMock),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update a product', async () => {
      const product = await productsService.update(
        productMock.id,
        updateProductMock,
      );

      expect(product).toEqual(productMock);
    });

    it('should throw an error', async () => {
      jest.spyOn(productsRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(
        productsService.update(productMock.id, updateProductMock),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should return an error when product does not exist', async () => {
      jest
        .spyOn(productsRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      await expect(productsService.remove(productMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should remove a product', async () => {
      const product = await productsService.remove(productMock.id);

      expect(product).toEqual(returnDeleteMock);
    });
  });
});
