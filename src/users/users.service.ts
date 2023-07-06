import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from './../enums/role.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { createPasswordHash } from './../utils/password';
import { comparePassword } from './../utils/password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, userType?: number): Promise<User> {
    console.log(`userType: ${userType}`);
    const user = await this.findOneByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('E-mail already registered');
    }

    createUserDto.password = await createPasswordHash(createUserDto.password);

    return this.usersRepository.save({
      ...createUserDto,
      typeUser: userType ? userType : Role.User,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneUsingRelations(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id },
        relations: {
          addresses: {
            city: {
              state: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { id },
    });

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });

    return updatedUser;
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (
      !(await comparePassword(
        updatePasswordDto.oldPassword,
        user?.password || '',
      ))
    ) {
      throw new BadRequestException('Old password does not match');
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      password: await createPasswordHash(updatePasswordDto.newPassword),
    });

    return updatedUser;
  }
}
