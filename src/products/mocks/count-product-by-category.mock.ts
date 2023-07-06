import { categoryMock } from './../../categories/mocks/category.mock';
import { CountProductByCategoryDto } from '../dto/count-product-by-category.dto';

export const countProductByCategoryMock: CountProductByCategoryDto = {
  category_id: categoryMock.id,
  total: 0,
};
