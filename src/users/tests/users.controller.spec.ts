import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '../users.controller';

import { UsersService } from '../users.service';
import { userMock } from '../mocks/user.mock';
import { createUserMock } from '../mocks/create-user.mock';
import { updatePasswordMock } from '../mocks/update-password.mock';
import { ReturnUserDto } from '../dto/return-user.dto';
import { Role } from './../../enums/role.enum';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockReturnValue(userMock),
            findAll: jest.fn().mockResolvedValue([userMock]),
            findOneUsingRelations: jest.fn().mockResolvedValue(userMock),
            findOne: jest.fn().mockResolvedValue(userMock),
            updatePassword: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should return an user', async () => {
      const user = await usersController.create(createUserMock);

      expect(user).toEqual(userMock);
    });

    it('should return an admin', async () => {
      const spy = jest.spyOn(usersService, 'create');
      const admin = await usersController.createAdmin(createUserMock);

      expect(admin).toEqual(userMock);
      expect(spy).toHaveBeenCalledWith(createUserMock, Role.Admin);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await usersController.findAll();

      expect(users).toEqual([
        {
          id: userMock.id,
          name: userMock.name,
          email: userMock.email,
          phone: userMock.phone,
          cpf: userMock.cpf,
        },
      ]);
    });
  });

  describe('findMe', () => {
    it('should return an user', async () => {
      const user = await usersController.findMe(userMock.id);

      expect(user).toEqual(new ReturnUserDto(userMock));
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const user = await usersController.findOne(userMock.id);

      expect(user).toEqual({
        id: userMock.id,
        name: userMock.name,
        email: userMock.email,
        phone: userMock.phone,
        cpf: userMock.cpf,
      });
    });
  });

  describe('updatePassword', () => {
    it('should return an user', async () => {
      const user = await usersController.updatePassword(
        updatePasswordMock,
        userMock.id,
      );

      expect(user).toEqual(userMock);
    });
  });
});
