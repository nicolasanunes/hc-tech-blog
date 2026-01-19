import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ListLoginDto, LoginPayloadDto } from './dto/list-login.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { validatePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ListLoginDto> {
    const user: User | undefined = await this.usersService
      .listUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isPasswordValid = await validatePassword(
      loginDto.password,
      user?.password || '',
    );

    if (!user || !isPasswordValid) {
      throw new NotFoundException('E-mail e/ou senha inválidos!');
    }

    const payload: LoginPayloadDto = {
      id: user.id,
      email: user.email,
    }; 

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }
}
