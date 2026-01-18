import { ListAuthUserDto } from 'src/users/dto/list-user.dto';

export class ListLoginDto {
  user: ListAuthUserDto;
  accessToken: string;
}

export class LoginPayloadDto {
  id: number;
  email: string;
}
