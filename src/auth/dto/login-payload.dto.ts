import { User } from './../../users/entities/user.entity';

export class LoginPayloadDto {
  id: number;
  typeUser: number;

  constructor(user: User) {
    this.id = user.id;
    this.typeUser = user.typeUser;
  }
}
