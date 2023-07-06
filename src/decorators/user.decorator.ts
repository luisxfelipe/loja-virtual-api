import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { authorizationToLoginPayload } from './../utils/base-64.converter';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { authorization } = ctx.switchToHttp().getRequest().headers;

    if (!authorization) {
      throw new BadRequestException('Authorization header not found');
    }

    const loginPayloadDto = authorizationToLoginPayload(
      authorization.replace('Bearer ', ''),
    );

    return loginPayloadDto?.id;
  },
);
