import { Product } from './../../products/entities/product.entity';

export class SizeProductDto {
  weight: number;
  length: number;
  height: number;
  width: number;
  diameter: number;
  productValue: number;

  constructor(product: Product) {
    this.weight = product.weight;
    this.length = product.length;
    this.height = product.height;
    this.width = product.width;
    this.diameter = product.diameter;
    this.productValue = product.price;
  }
}
