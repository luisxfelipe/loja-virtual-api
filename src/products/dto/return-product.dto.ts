import { ReturnCategoryDto } from './../../categories/dto/return-category.dto';
import { Product } from '../entities/product.entity';

export class ReturnProductDto {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: ReturnCategoryDto;
  weight: number;
  length: number;
  height: number;
  width: number;
  diameter: number;

  constructor(productEntity: Product) {
    this.id = productEntity.id;
    this.name = productEntity.name;
    this.price = productEntity.price;
    this.image = productEntity.image;
    this.category = productEntity.category
      ? new ReturnCategoryDto(productEntity.category)
      : undefined;
    this.weight = productEntity.weight;
    this.length = productEntity.length;
    this.height = productEntity.height;
    this.width = productEntity.width;
    this.diameter = productEntity.diameter;
  }
}
