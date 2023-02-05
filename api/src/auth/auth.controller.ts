import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private logger = new Logger('Auth Controller');

  @Post('/signup')
  signup(@Body() signupauthdto: SignUpAuthDto): Promise<User> {
    this.logger.verbose(`SigingUp a user with email: ${signupauthdto.email}`);
    return this.authService.signup(signupauthdto);
  }

  @Post('/signin')
  signin(
    @Body() signInAuthDto: SignInAuthDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`Signing in a user with email: ${signInAuthDto.email}`);
    return this.authService.signin(signInAuthDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getOneUser(@Param('id') id: string): Promise<User> {
    return this.authService.getOneUser(id);
  }
}
