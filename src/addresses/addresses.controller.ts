import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { AddressesService } from './addresses.service';

import { CreateAddressDto } from './dto/create-address.dto';

import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from './../enums/role.enum';
import { Roles } from './../decorators/roles.decorator';
import { UserDecorator } from './../decorators/user.decorator';
import { Address } from './entities/address.entity';
import { ReturnAddressDto } from './dto/return-address.dto';

@Controller('addresses')
@ApiTags('Addresses')
@Roles(Role.User, Role.Admin, Role.Root)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @UserDecorator() userId: number,
  ) {
    return this.addressesService.create(createAddressDto, userId);
  }

  @Get()
  async findAllByUserId(
    @UserDecorator() userId: number,
  ): Promise<ReturnAddressDto[]> {
    return (await this.addressesService.findAllByUserId(userId)).map(
      (address: Address) => new ReturnAddressDto(address),
    );
  }
}
