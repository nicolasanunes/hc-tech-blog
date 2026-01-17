import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ListLoginDto } from './dto/list-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() login: LoginDto): Promise<ListLoginDto> {
    return this.authService.login(login);
  }
}
