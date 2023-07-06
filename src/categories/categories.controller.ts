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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnCategoryDto } from './dto/return-category.dto';
import { Roles } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';
import { Category } from './entities/category.entity';
import { DeleteResult } from 'typeorm';

@Controller('categories')
@ApiTags('categories')
@Roles(Role.Admin, Role.Root, Role.User)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin, Role.Root)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<ReturnCategoryDto[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnCategoryDto> {
    return new ReturnCategoryDto(
      await this.categoriesService.findOne(id, true),
    );
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Root)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Root)
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.categoriesService.remove(id);
  }
}
