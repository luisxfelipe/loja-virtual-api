import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ApiTags } from '@nestjs/swagger';
import { ReturnCepDto } from './dto/return-cep.dto';

@Controller('correios')
@ApiTags('Correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get(':cep')
  findAll(@Param('cep') cep: string): Promise<ReturnCepDto> {
    return this.correiosService.findAddressByCep(cep);
  }
}
