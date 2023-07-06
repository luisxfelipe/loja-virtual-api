import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userMock } from '../mocks/user.mock';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { createUserMock } from '../mocks/create-user.mock';
import { Role } from '../../enums/role.enum';
import { updatePasswordMock } from './../mocks/update-password.mock';
import { comparePassword } from './../../utils/password';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneOrFail: jest.fn().mockResolvedValue(userMock),
            findOneByOrFail: jest.fn().mockResolvedValue(userMock),
            save: jest.fn().mockReturnValue(userMock),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('FindOne', () => {
    it('should return an user', async () => {
      const user = await usersService.findOne(userMock.id);

      expect(user).toEqual(userMock);
    });

    it('should return an error', async () => {
      jest
        .spyOn(usersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(usersService.findOne(userMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneUsingRelations', () => {
    it('should return an user', async () => {
      const user = await usersService.findOneUsingRelations(userMock.id);

      expect(user).toEqual(userMock);
    });

    it('should return an error', async () => {
      jest
        .spyOn(usersRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(usersService.findOneUsingRelations(userMock.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return an user', async () => {
      const user = await usersService.findOneByEmail(userMock.email);

      expect(user).toEqual(userMock);
    });

    it('should return an error', async () => {
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());

      expect(usersService.findOneByEmail(userMock.email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should return an error when email already exists', async () => {
      expect(usersService.create(createUserMock)).rejects.toThrow(
        BadGatewayException,
      );
    });

    it('should return an user', async () => {
      const spy = jest.spyOn(usersRepository, 'save');
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(undefined);

      const user = await usersService.create(createUserMock);

      expect(user).toEqual(userMock);
      expect(spy.mock.calls[0][0].typeUser).toEqual(Role.User);
    });

    it('should return an admin', async () => {
      const spy = jest.spyOn(usersRepository, 'save');
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(undefined);

      await usersService.create(createUserMock, Role.Admin);

      expect(spy.mock.calls[0][0].typeUser).toEqual(Role.Admin);
    });
  });

  describe('updatePasswod', () => {
    it('should return an user', async () => {
      const spy = jest.spyOn(usersRepository, 'save');
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(undefined);

      const user = await usersService.updatePassword(
        userMock.id,
        updatePasswordMock,
      );

      expect(user).toEqual(userMock);
    });

    it('should return an error when old password is wrong', async () => {
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(userMock);

      expect(
        usersService.updatePassword(userMock.id, {
          ...updatePasswordMock,
          oldPassword: 'wrong_password',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return an error when user not exists', async () => {
      jest
        .spyOn(usersRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(undefined);

      expect(
        usersService.updatePassword(userMock.id, updatePasswordMock),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
