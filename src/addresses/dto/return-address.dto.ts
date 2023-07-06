import { ReturnCityDto } from './../../cities/dto/return-city.dto';
import { Address } from '../entities/address.entity';

export class ReturnAddressDto {
  id: number;
  complement: string;
  number: string;
  cep: string;
  city?: ReturnCityDto;

  constructor(address: Address) {
    this.id = address.id;
    this.complement = address.complement;
    this.number = address.number;
    this.cep = address.cep;
    this.city = address.city ? new ReturnCityDto(address.city) : undefined;
  }
}
