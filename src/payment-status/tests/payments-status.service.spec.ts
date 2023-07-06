import { Test, TestingModule } from '@nestjs/testing';
import { PaymentStatusService } from '../payment-status.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentStatus } from '../entities/payment-status.entity';

describe('PaymentsStatusService', () => {
  let paymentStatusService: PaymentStatusService;
  let paymentsStatusRepository: Repository<PaymentStatus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentStatusService,
        {
          provide: getRepositoryToken(PaymentStatus),
          useValue: {},
        },
      ],
    }).compile();

    paymentStatusService =
      module.get<PaymentStatusService>(PaymentStatusService);
    paymentsStatusRepository = module.get<Repository<PaymentStatus>>(
      getRepositoryToken(PaymentStatus),
    );
  });

  it('should be defined', () => {
    expect(paymentStatusService).toBeDefined();
    expect(paymentsStatusRepository).toBeDefined();
  });
});
