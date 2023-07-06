import { userMock } from './../../users/mocks/user.mock';
import { ReturnLoginDto } from '../dto/return-login.dto';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLoginDto = {
  access_token: jwtMock,
  user: userMock,
};
