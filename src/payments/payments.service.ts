import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentType } from './../payment-status/enums/payment-type.enum';
import { CreateOrderDto } from './../orders/dto/create-order.dto';
import { PaymentCreditCard } from './entities/payment-credit-card.entity';
import { Cart } from './../carts/entities/cart.entity';
import { Product } from './../products/entities/product.entity';
import { CartProduct } from './../cart-products/entities/cart-product.entity';
import { PaymentPix } from './entities/payment-pix.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    products: Product[],
    cart: Cart,
  ): Promise<Payment> {
    const finalPrice = this.generateFinalPrice(cart, products);

    if (createOrderDto.amountPayments) {
      const paymentCreditCard = new PaymentCreditCard(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDto,
      );

      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDto.codePix && createOrderDto.datePayment) {
      const paymentPix = new PaymentPix(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDto,
      );

      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException(
      'AmountPayments or CodePix and DatePayment must be informed',
    );
  }

  generateFinalPrice(cart: Cart, products: Product[]): number {
    if (!cart.cartProducts || cart.cartProducts.length === 0) {
      return 0;
    }

    return Number(
      cart.cartProducts
        .map((cartProduct: CartProduct) => {
          const product = products.find(
            (product: Product) => product.id === cartProduct.productId,
          );
          if (product) {
            return product.price * cartProduct.quantity;
          }

          return 0;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        .toFixed(2),
    );
  }
}
