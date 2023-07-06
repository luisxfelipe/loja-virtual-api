import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { StatesService } from './states.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('states')
@ApiTags('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  findAll() {
    return this.statesService.findAll();
  }
}
