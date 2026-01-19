import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ListLoginDto, LoginPayloadDto } from './dto/list-login.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { validatePassword } from 'src/utils/password';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: RefreshTokenDto): Promise<ListLoginDto> {
    try {
      // Verifica e decodifica o refresh token
      const payload = this.jwtService.verify<LoginPayloadDto>(refreshToken.refreshToken);

      // Valida se o usuário existe e está ativo
      const user: User = await this.usersService.findUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const newPayload: LoginPayloadDto = {
        id: user.id,
        email: user.email,
      };

      // Gera novos tokens
      return {
        accessToken: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
        user: {
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }
}
