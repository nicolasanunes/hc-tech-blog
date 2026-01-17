import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ListLoginDto } from './dto/list-login.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { validatePassword } from 'src/utils/password';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { ListUserDto } from 'src/users/dto/list-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(login: LoginDto): Promise<ListLoginDto> {
    const user: User | undefined = await this.usersService
      .listUserByEmail(login.email)
      .catch(() => undefined);

    const isPasswordValid = await validatePassword(
      login.password,
      user?.password || '',
    );

    if (!user || !isPasswordValid) {
      throw new NotFoundException('E-mail e/ou senha inválidos!');
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayloadDto(user) }),
      user: new ListUserDto(user),
    };
  }
}
