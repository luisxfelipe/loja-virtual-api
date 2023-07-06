import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { paymentMock } from '../mocks/payment.mock';
import {
  createOrderCreditCardMock,
  createOrderPixMock,
} from './../../orders/mocks/create-order,mock';
import { cartMock } from './../../carts/mocks/cart.mock';
import { productMock } from './../../products/mocks/product.mock';
import { PaymentPix } from '../entities/payment-pix.entity';
import { paymentPixMock } from '../mocks/payment-pix.mock';
import { PaymentCreditCard } from '../entities/payment-credit-card.entity';
import { paymentCreditCardMock } from '../mocks/payment-credit-card.mock';
import { BadRequestException } from '@nestjs/common';
import { cartProductMock } from './../../cart-products/mocks/cart-product.mock';
import { PaymentType } from './../../payment-status/enums/payment-type.enum';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let paymentsRepository: Repository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            save: jest.fn().mockResolvedValue(paymentMock),
          },
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
  });

  it('should be defined', () => {
    expect(paymentsService).toBeDefined();
    expect(paymentsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment pix', async () => {
      const spy = jest.spyOn(paymentsRepository, 'save');
      const payment = await paymentsService.create(
        createOrderPixMock,
        [productMock],
        cartMock,
      );

      const paymentPix: PaymentPix = spy.mock.calls[0][0] as PaymentPix;

      expect(payment).toEqual(paymentMock);
      expect(paymentPix.code).toEqual(paymentPixMock.code);
      expect(paymentPix.datePayment).toEqual(paymentPixMock.datePayment);
    });

    it('should create a payment credit card', async () => {
      const spy = jest.spyOn(paymentsRepository, 'save');
      const payment = await paymentsService.create(
        createOrderCreditCardMock,
        [productMock],
        cartMock,
      );

      const paymentCreditCard: PaymentCreditCard = spy.mock
        .calls[0][0] as PaymentCreditCard;

      expect(payment).toEqual(paymentMock);
      expect(paymentCreditCard.amountPayments).toEqual(
        paymentCreditCardMock.amountPayments,
      );
    });

    it('should return an exception when creating a payment without payment date', async () => {
      const spy = jest.spyOn(paymentsRepository, 'save');

      await expect(
        paymentsService.create(
          {
            addressId: createOrderPixMock.addressId,
          },
          [productMock],
          cartMock,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a payment with final price 0 when cart is empty', async () => {
      const spy = jest.spyOn(paymentsRepository, 'save');
      await paymentsService.create(
        createOrderCreditCardMock,
        [productMock],
        cartMock,
      );

      const paymentCreditCard: PaymentCreditCard = spy.mock
        .calls[0][0] as PaymentCreditCard;

      expect(paymentCreditCard.finalPrice).toEqual(0);
    });

    it('should create a payment with final price calculated', async () => {
      const spy = jest.spyOn(paymentsRepository, 'save');
      await paymentsService.create(createOrderCreditCardMock, [productMock], {
        ...cartMock,
        cartProducts: [cartProductMock],
      });

      const paymentCreditCard: PaymentCreditCard = spy.mock
        .calls[0][0] as PaymentCreditCard;

      expect(paymentCreditCard.finalPrice).toEqual(179.86);
    });

    it('should return all data from payment', async () => {
      const spy = jest.spyOn(paymentsRepository, 'save');
      await paymentsService.create(createOrderCreditCardMock, [productMock], {
        ...cartMock,
        cartProducts: [cartProductMock],
      });

      const savePayment: PaymentCreditCard = spy.mock
        .calls[0][0] as PaymentCreditCard;

      const paymentCreditCard: PaymentCreditCard = new PaymentCreditCard(
        PaymentType.Done,
        179.86,
        0,
        179.86,
        createOrderCreditCardMock,
      );

      expect(savePayment).toEqual(paymentCreditCard);
    });
  });
});
