import { userMock } from './../../users/mocks/user.mock';
import { LoginDto } from '../dto/login.dto';

export const loginUserMock: LoginDto = {
  email: userMock.email,
  password: '123456',
};
