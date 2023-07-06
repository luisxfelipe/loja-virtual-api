import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ReturnCepDto } from './dto/return-cep.dto';
import { ReturnCepExternalDto } from './dto/return-cep-external.dto';
import { City } from './../cities/entities/city.entity';
import { CitiesService } from './../cities/cities.service';
import { Client } from 'nestjs-soap';
import { ResponsePriceCorreiosDto } from './dto/response-price-correios.dto';
import { ConfigService } from '@nestjs/config';
import { CdFormatEnum } from './enums/cd-format.enum';
import { SizeProductDto } from './dto/size-product.dto';

@Injectable()
export class CorreiosService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('SOAP_CORREIOS') private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly citiesService: CitiesService,
  ) {}

  /*
  async findAddressByCep(cep: string): Promise<ReturnCepDto> {
    const returnCep: ReturnCepExternalDto = await this.httpService.axiosRef
      .get<ReturnCepExternalDto>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException('CEP not found');
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`,
        );
      });

    const city: City | undefined = await this.citiesService
      .findByName(returnCep.localidade, returnCep.uf)
      .catch(() => undefined);

    return new ReturnCepDto(returnCep, city?.id, city?.state?.id);
  }*/

  async findAddressByCep(cep: string): Promise<any> {
    try {
      const endereco =
        await this.httpService.axiosRef.get<ReturnCepExternalDto>(
          this.configService
            .get<string>('URL_CEP_CORREIOS')
            .replace('{CEP}', cep),
        );

      if (endereco.data.erro) {
        throw new NotFoundException('CEP not found');
      }

      const city: City | undefined = await this.citiesService
        .findByName(endereco.data.localidade, endereco.data.uf)
        .catch(() => undefined);

      return new ReturnCepDto(endereco.data, city?.id, city?.state?.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async calculatePriceDelivery(
    CdServico: string,
    cep: string,
    sizeProductDto: SizeProductDto,
  ): Promise<ResponsePriceCorreiosDto> {
    return new Promise((resolve) => {
      this.soapClient.CalcPrecoPrazo(
        {
          nCdEmpresa: '',
          sDsSenha: '',
          nCdServico: CdServico,
          sCepOrigem: this.configService.get<string>('CEP_COMPANY'),
          sCepDestino: cep,
          nVlPeso: sizeProductDto.weight,
          nCdFormato: CdFormatEnum.BOX,
          nVlComprimento: sizeProductDto.length,
          nVlAltura: sizeProductDto.height,
          nVlLargura: sizeProductDto.width,
          nVlDiametro: sizeProductDto.diameter,
          sCdMaoPropria: 'N',
          nVlValorDeclarado:
            sizeProductDto.productValue < 25 ? 25 : sizeProductDto.productValue,
          sCdAvisoRecebimento: 'N',
        },
        (_, result: ResponsePriceCorreiosDto) => {
          if (result) {
            resolve(result);
          } else {
            throw new BadRequestException('Error SOAP');
          }
        },
      );
    });
  }
}
