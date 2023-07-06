import { categoryMock } from './../../categories/mocks/category.mock';
import { Product } from '../entities/product.entity';
import { PaginationDto } from './../../dtos/pagination.dto';

export const productMock: Product = {
  id: 1,
  name: 'Product 1',
  price: 89.93,
  image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
  categoryId: categoryMock.id,
  weight: 0.5,
  length: 30,
  height: 30,
  width: 30,
  diameter: 30,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const paginationProductMock: PaginationDto<Product[]> = {
  data: [productMock],
  meta: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 10,
    totalPages: 1,
  },
};
