import { categoryMock } from './../../categories/mocks/category.mock';
import { UpdateProductDto } from '../dto/update-product.dto';

export const updateProductMock: UpdateProductDto = {
  name: 'Product 01',
  price: 9.1,
  image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
  categoryId: categoryMock.id,
  weight: 0.5,
  length: 30,
  height: 30,
  width: 30,
  diameter: 30,
};
