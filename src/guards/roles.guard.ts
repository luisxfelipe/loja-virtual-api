import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { LoginPayloadDto } from './../auth/dto/login-payload.dto';
import { ROLES_KEY } from './../decorators/roles.decorator';
import { Role } from './../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;

    if (!authorization) {
      return false;
    }

    const authorizationSplited = authorization.split(' ')[1];

    const loginPayload: LoginPayloadDto | undefined = await this.jwtService
      .verifyAsync(authorizationSplited, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      })
      .catch(() => undefined);

    if (!loginPayload) {
      return false;
    }

    return requiredRoles.some((role) => role === loginPayload.typeUser);
  }
}
