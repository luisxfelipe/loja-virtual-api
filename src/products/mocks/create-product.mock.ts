import { categoryMock } from './../../categories/mocks/category.mock';
import { CreateProductDto } from '../dto/create-product.dto';

export const createProductMock: CreateProductDto = {
  name: 'Product 1',
  price: 89.9,
  image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
  categoryId: categoryMock.id,
  weight: 0.5,
  length: 30,
  height: 30,
  width: 30,
  diameter: 30,
};
