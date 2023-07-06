import { ReturnUserDto } from './../../users/dto/return-user.dto';

export class ReturnLoginDto {
  user: ReturnUserDto;
  access_token: string;
}
