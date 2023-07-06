import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { categoryMock } from '../mocks/category.mock';
import { returnDeleteMock } from './../../mocks/return-delete.mock';
import { createCategoryMock } from '../mocks/create-category.mock';
import { updateCategoryMock } from '../mocks/update-category.mock';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([categoryMock]),
            create: jest.fn().mockResolvedValue(categoryMock),
            remove: jest.fn().mockResolvedValue(returnDeleteMock),
            update: jest.fn().mockResolvedValue(categoryMock),
            findOne: jest.fn().mockResolvedValue(categoryMock),
          },
        },
      ],
    }).compile();

    categoriesController =
      module.get<CategoriesController>(CategoriesController);

    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(categoriesController).toBeDefined();
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a new category', async () => {
      const category = await categoriesController.create(createCategoryMock);

      expect(category).toEqual(categoryMock);
    });
  });

  describe('findAll', () => {
    it('should be able to return an array of categories', async () => {
      const categories = await categoriesController.findAll();

      expect(categories).toEqual([categoryMock]);
    });
  });

  describe('findOne', () => {
    it('should be able to return a category by id', async () => {
      const category = await categoriesController.findOne(categoryMock.id);

      expect(category).toEqual({
        id: categoryMock.id,
        name: categoryMock.name,
      });
    });

    it('should send id param to service', async () => {
      const spy = jest.spyOn(categoriesService, 'findOne');

      await categoriesController.findOne(categoryMock.id);

      expect(spy).toHaveBeenCalledWith(categoryMock.id, true);
    });
  });

  describe('update', () => {
    it('should be able to update a category', async () => {
      const category = await categoriesController.update(
        categoryMock.id,
        updateCategoryMock,
      );

      expect(category).toEqual(categoryMock);
    });

    it('should send id param and updateCategoryDto to service', async () => {
      const spy = jest.spyOn(categoriesService, 'update');

      await categoriesController.update(categoryMock.id, updateCategoryMock);

      expect(spy).toHaveBeenCalledWith(categoryMock.id, updateCategoryMock);
    });
  });

  describe('remove', () => {
    it('should be able to delete a category', async () => {
      const category = await categoriesController.remove(categoryMock.id);

      expect(category).toEqual(returnDeleteMock);
    });

    it('should send id param to service', async () => {
      const spy = jest.spyOn(categoriesService, 'remove');

      await categoriesController.remove(categoryMock.id);

      expect(spy).toHaveBeenCalledWith(categoryMock.id);
    });
  });
});
