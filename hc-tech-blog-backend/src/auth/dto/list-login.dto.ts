import { ListAuthUserDto } from 'src/users/dto/list-user.dto';
import { RefreshTokenDto } from './refresh-token.dto';

export class ListLoginDto {
  user: ListAuthUserDto;
  accessToken: string;
  refreshToken: string;
}

export class LoginPayloadDto {
  id: number;
  email: string;
}
