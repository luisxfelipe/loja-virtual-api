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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserDecorator } from './../decorators/user.decorator';
import { Order } from './entities/order.entity';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';
import { ReturnOrderDto } from './dto/return-order.dto';

@Controller('orders')
@ApiTags('orders')
@Roles(Role.Admin, Role.Root, Role.User)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UserDecorator('id') userId: number,
  ): Promise<Order> {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  async findByUserId(@UserDecorator('id') userId: number) {
    return this.ordersService.findByUserId(userId);
  }

  @Get('all')
  @Roles(Role.Admin, Role.Root)
  async findAll(): Promise<ReturnOrderDto[]> {
    return (await this.ordersService.findAll()).map(
      (order) => new ReturnOrderDto(order),
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Root)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnOrderDto> {
    return new ReturnOrderDto(
      (await this.ordersService.findByUserId(undefined, id))[0],
    );
  }
}
