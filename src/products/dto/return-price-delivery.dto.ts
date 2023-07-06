import { ResponsePriceCorreiosDto } from './../../correios/dto/response-price-correios.dto';

interface ReturnDeliveryDto {
  deliveryTime: number;
  deliveryPrice: number;
  typeDelivery: number;
}

export class ReturnPriceDeliveryDto {
  delivery: ReturnDeliveryDto[];

  constructor(priceCorreios: ResponsePriceCorreiosDto[]) {
    this.delivery = priceCorreios
      .filter(
        (priceCorreio) =>
          priceCorreio.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.Erro ===
          '0',
      )
      .map((priceCorreio) => ({
        deliveryPrice: Number(
          priceCorreio.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.Valor.replace(
            ',',
            '.',
          ),
        ),
        deliveryTime: Number(
          priceCorreio.CalcPrecoPrazoResult?.Servicos?.cServico[0]
            ?.PrazoEntrega,
        ),
        typeDelivery: Number(
          priceCorreio.CalcPrecoPrazoResult?.Servicos?.cServico[0]?.Codigo,
        ),
      }));
  }
}
