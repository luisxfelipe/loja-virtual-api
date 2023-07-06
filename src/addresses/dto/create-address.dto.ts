import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  complement: string;

  @IsString()
  number: string;

  @IsString()
  cep: string;

  @IsInt()
  cityId: number;
}
