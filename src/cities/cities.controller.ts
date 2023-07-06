import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { CitiesService } from './cities.service';
import { ApiTags } from '@nestjs/swagger';
import { City } from './entities/city.entity';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<City> {
    return await this.citiesService.findOne(id);
  }

  @Get('state/:stateId')
  findByStateId(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.citiesService.findByStateId(stateId);
  }
}
