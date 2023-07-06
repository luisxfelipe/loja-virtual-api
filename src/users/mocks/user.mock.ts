import { Role } from './../../enums/role.enum';
import { User } from '../entities/user.entity';

export const userMock: User = {
  id: 1,
  name: 'Cláudio Luis',
  cpf: '12345678910',
  phone: '12345678910',
  email: 'claudio.luis@mock.com',
  password: '$2b$10$7fY3wUXbhVP4nVlUb29wFOQP4EQX2lVG5/SyI3qQ80matWjORB.zK',
  typeUser: Role.User,
  createdAt: new Date(),
  updatedAt: new Date(),
};
