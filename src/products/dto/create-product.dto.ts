import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsNumber()
  categoryId: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  length: number;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  diameter: number;
}
