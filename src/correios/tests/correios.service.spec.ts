import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from '../correios.service';
import { CitiesService } from './../../cities/cities.service';
import { HttpService } from '@nestjs/axios';

describe('CorreiosService', () => {
  let correiosService: CorreiosService;
  let citiesService: CitiesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorreiosService,
        {
          provide: CitiesService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: 'SOAP_CORREIOS',
          useValue: {},
        },
        {
          provide: CorreiosService,
          useValue: {},
        },
      ],
    }).compile();

    correiosService = module.get<CorreiosService>(CorreiosService);
    citiesService = module.get<CitiesService>(CitiesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(correiosService).toBeDefined();
    expect(citiesService).toBeDefined();
    expect(httpService).toBeDefined();
  });
});
