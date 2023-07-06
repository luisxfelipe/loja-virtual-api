import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './../users/entities/user.entity';
import { ReturnUserDto } from './../users/dto/return-user.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { comparePassword } from './../utils/password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user: User | undefined = await this.usersService
      .findOneByEmail(loginDto.email)
      .catch(() => undefined);

    if (
      !user ||
      !(await comparePassword(loginDto.password, user.password || ''))
    ) {
      throw new UnauthorizedException('Email or password invalid!');
    }

    return {
      access_token: await this.jwtService.sign({
        ...new LoginPayloadDto(user),
      }),
      user: new ReturnUserDto(user),
    };
  }
}
