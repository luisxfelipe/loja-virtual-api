import { ReturnProductDto } from './../../products/dto/return-product.dto';
import { Category } from '../entities/category.entity';

export class ReturnCategoryDto {
  id: number;
  name: string;
  quantityProducts?: number;
  products?: ReturnProductDto[];

  constructor(category: Category, quantityProducts?: number) {
    this.id = category.id;
    this.name = category.name;
    this.quantityProducts = quantityProducts;
    this.products = category.products
      ? category.products.map((product) => new ReturnProductDto(product))
      : undefined;
  }
}
