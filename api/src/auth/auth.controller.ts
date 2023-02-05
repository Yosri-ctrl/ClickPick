import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UpdateUserPassDto } from './dto/update-user-pass.dto';
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
    this.logger.verbose(`Getting data for user: ${id}`);
    return this.authService.getOneUser(id);
  }

  @Get()
  @UseGuards(AuthGuard())
  getAllUser(): Promise<User[]> {
    this.logger.verbose(`Getting data for all users`);
    return this.authService.getAllUser();
  }

  @Patch('/:id/username')
  @UseGuards(AuthGuard())
  updateUserUsername(
    @Param('id') id: string,
    @Body('username') username: string,
  ): Promise<User> {
    this.logger.verbose(`Updating username for user: ${id}`);
    return this.authService.updateUserUsername(id, username);
  }

  @Patch('/:id/password')
  @UseGuards(AuthGuard())
  updateUserPass(
    @Param('id') id: string,
    @Body() updateUserPassDto: UpdateUserPassDto,
  ): Promise<User> {
    this.logger.verbose(`Updating password for user: ${id}`);
    return this.authService.updateUserPass(id, updateUserPassDto);
  }
}
