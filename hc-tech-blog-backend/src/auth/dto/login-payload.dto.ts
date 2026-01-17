import { User } from 'src/users/entities/user.entity';

export class LoginPayloadDto {
  id: number;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
  }
}
