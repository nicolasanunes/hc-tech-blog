import { User } from '../entities/user.entity';

export class ListUserDto {
  email: string;
  name: string;

  constructor(user: User) {
    this.email = user.email;
    this.name = user.name;
  }
}