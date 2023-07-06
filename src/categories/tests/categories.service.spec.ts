import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories.service';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '../mocks/category.mock';
import { createCategoryMock } from '../mocks/create-category.mock';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReturnCategoryDto } from '../dto/return-category.dto';
import { ProductsService } from './../../products/products.service';
import { countProductByCategoryMock } from './../../products/mocks/count-product-by-category.mock';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { productMock } from './../../products/mocks/product.mock';
import { updateCategoryMock } from '../mocks/update-category.mock';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoriesRepository: Repository<Category>;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: ProductsService,
          useValue: {
            countProductsByCategory: jest
              .fn()
              .mockResolvedValue([countProductByCategoryMock]),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryMock]),
            findByName: jest.fn().mockResolvedValue(categoryMock),
            findOneOrFail: jest.fn().mockResolvedValue(categoryMock),
            findOneByOrFail: jest.fn().mockResolvedValue(categoryMock),
            create: jest.fn().mockReturnValue(categoryMock),
            save: jest.fn().mockResolvedValue(categoryMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    categoriesRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
    expect(categoriesRepository).toBeDefined();
    expect(productsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = await categoriesService.findAll();

      expect(categories).toEqual([
        new ReturnCategoryDto(categoryMock, countProductByCategoryMock.total),
      ]);
    });

    it('should return an empty array', async () => {
      jest.spyOn(categoriesRepository, 'find').mockResolvedValueOnce([]);

      const categories = await categoriesService.findAll();

      expect(categories).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const category = await categoriesService.findOne(categoryMock.id);

      expect(category).toEqual(categoryMock);
    });

    it('should return an error', async () => {
      jest
        .spyOn(categoriesRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(categoriesService.findOne(categoryMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByName', () => {
    it('should return a category', async () => {
      const category = await categoriesService.findOneByName(categoryMock.name);

      expect(category).toEqual(categoryMock);
    });

    it('should return an error', async () => {
      jest
        .spyOn(categoriesRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());

      expect(
        categoriesService.findOneByName(categoryMock.name),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should return an error if category already exists', async () => {
      expect(categoriesService.create(createCategoryMock)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a category', async () => {
      jest
        .spyOn(categoriesRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(undefined);

      const category = await categoriesService.create(createCategoryMock);

      expect(category).toEqual(categoryMock);
    });

    it('should return an error', async () => {
      jest
        .spyOn(categoriesRepository, 'save')
        .mockRejectedValueOnce(new Error());

      expect(categoriesService.create(createCategoryMock)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const spy = jest
        .spyOn(categoriesRepository, 'findOneOrFail')
        .mockResolvedValueOnce(categoryMock);
      const category = await categoriesService.update(
        categoryMock.id,
        updateCategoryMock,
      );

      expect(category).toEqual(categoryMock);
      expect(spy).toBeCalledTimes(1);
    });

    it('should send new category to save', async () => {
      const spy = jest
        .spyOn(categoriesRepository, 'save')
        .mockResolvedValueOnce(categoryMock);
      await categoriesService.update(categoryMock.id, updateCategoryMock);

      expect(spy.mock.calls[0][0]).toEqual({
        ...categoryMock,
        ...updateCategoryMock,
      });
    });
  });

  describe('remove', () => {
    it('should return an error if category does not exists', async () => {
      jest
        .spyOn(categoriesRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(categoriesService.remove(categoryMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return relations in findOne', async () => {
      const spy = jest
        .spyOn(categoriesRepository, 'findOneOrFail')
        .mockResolvedValueOnce(categoryMock);

      await categoriesService.remove(categoryMock.id);

      expect(spy.mock.calls[0][0]).toEqual({
        where: { id: categoryMock.id },
        relations: {
          products: true,
        },
      });
    });

    it('should return an error if category has products', async () => {
      jest.spyOn(categoriesRepository, 'findOneOrFail').mockResolvedValueOnce({
        ...categoryMock,
        products: [productMock],
      });

      expect(categoriesService.remove(categoryMock.id)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should delete a category', async () => {
      const category = await categoriesService.remove(categoryMock.id);

      expect(category).toEqual(returnDeleteMock);
    });
  });
});
