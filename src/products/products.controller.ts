import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnProductDto } from './dto/return-product.dto';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';
import { Product } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { ReturnPriceDeliveryDto } from './dto/return-price-delivery.dto';
import { PaginationDto } from './../dtos/pagination.dto';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.Admin, Role.Root)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Root, Role.User)
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productsService.findAll([], true)).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Roles(Role.Admin, Role.Root, Role.User)
  @Get('/page')
  async findAllPage(
    @Query('search') search?: string,
    @Query('take') take?: number,
    @Query('page') page?: number,
  ): Promise<PaginationDto<ReturnProductDto[]>> {
    return this.productsService.findAllPage(search, take, page);
  }

  @Get('/:productId/delivery/:cep')
  async calculatePriceDelivery(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('cep') cep: string,
  ): Promise<ReturnPriceDeliveryDto> {
    return await this.productsService.calculatePriceDelivery(productId, cep);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Root, Role.User)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(await this.productsService.findOne(id, true));
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Root)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Root)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.productsService.remove(id);
  }
}
