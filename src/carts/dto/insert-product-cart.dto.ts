import { IsInt } from 'class-validator';

export class InsertProductCartDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;
}
