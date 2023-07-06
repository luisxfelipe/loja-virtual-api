import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from './../../users/users.service';
import { userMock } from './../../users/mocks/user.mock';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../mocks/jwt.mock';
import { loginUserMock } from '../mocks/login-user.mock';
import { ReturnUserDto } from './../../users/dto/return-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(userMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('login', () => {
    it('should return a user', async () => {
      const user = await authService.login(loginUserMock);
      expect(user).toEqual({
        access_token: jwtMock,
        user: new ReturnUserDto(userMock),
      });
    });

    it('should return null if password is invalid', async () => {
      expect(
        authService.login({ ...loginUserMock, password: 'invalid' }),
      ).rejects.toThrowError();
    });

    it('should return null if email is invalid', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValueOnce(undefined);
      expect(authService.login(loginUserMock)).rejects.toThrowError();
    });

    it('should return an error', async () => {
      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockRejectedValueOnce(new Error());

      expect(authService.login(loginUserMock)).rejects.toThrowError();
    });
  });
});
