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

import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Role } from './../enums/role.enum';
import { Roles } from './../decorators/roles.decorator';
import { UserDecorator } from './../decorators/user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/admin')
  @Roles(Role.Root)
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, Role.Admin);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/all')
  @Roles(Role.Admin, Role.Root)
  async findAll(): Promise<ReturnUserDto[]> {
    return (await this.usersService.findAll()).map(
      (user) => new ReturnUserDto(user),
    );
  }

  @Get()
  @Roles(Role.Admin, Role.Root, Role.User)
  async findMe(@UserDecorator() userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.usersService.findOneUsingRelations(userId),
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Root)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.usersService.findOne(id));
  }

  @Get(':id/addresses')
  async findOneUsingRelations(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.usersService.findOneUsingRelations(id));
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Root)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.usersService.update(id, updateUserDto));
  }

  @Patch(':id/password')
  @Roles(Role.Admin, Role.Root, Role.User)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @UserDecorator() userId: number,
  ): Promise<User> {
    return await this.usersService.updatePassword(userId, updatePasswordDto);
  }
}
