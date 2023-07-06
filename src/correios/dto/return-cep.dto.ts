import { ReturnCepExternalDto } from './return-cep-external.dto';

export class ReturnCepDto {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  ddd: string;
  cityId?: number;
  stateId?: number;

  constructor(
    returnCepExternalDto: ReturnCepExternalDto,
    cityId?: number,
    stateId?: number,
  ) {
    this.cep = returnCepExternalDto.cep;
    this.street = returnCepExternalDto.logradouro;
    this.complement = returnCepExternalDto.complemento;
    this.neighborhood = returnCepExternalDto.bairro;
    this.city = returnCepExternalDto.localidade;
    this.uf = returnCepExternalDto.uf;
    this.ddd = returnCepExternalDto.ddd;
    this.cityId = cityId;
    this.stateId = stateId;
  }
}
