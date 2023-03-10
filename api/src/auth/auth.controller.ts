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
import { GetUser } from './get-user.decorator';
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
    @GetUser() user: User,
  ): Promise<User> {
    this.logger.verbose(`Updating username for user: ${id}`);
    return this.authService.updateUserUsername(user, username);
  }

  @Patch('/:id/password')
  @UseGuards(AuthGuard())
  updateUserPass(
    @Param('id') id: string,
    @Body() updateUserPassDto: UpdateUserPassDto,
    @GetUser() user: User,
  ): Promise<User> {
    this.logger.verbose(`Updating password for user: ${id}`);
    return this.authService.updateUserPass(user, updateUserPassDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  deleteUser(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`Deleting user: ${id}`);
    return this.authService.deleteUser(user);
  }

  @Patch(':id/follow')
  @UseGuards(AuthGuard())
  followUser(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User: ${user.id} following user: ${id}`);
    return this.authService.followUser(user, id);
  }

  @Patch(':id/unfollow')
  @UseGuards(AuthGuard())
  unfollowUser(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User: ${user.id} unfollowing user: ${id}`);
    return this.authService.unfollowUser(user, id);
  }

  @Get('/:id/getfollowers')
  @UseGuards(AuthGuard())
  getFollowers(@GetUser() user: User): Promise<User[]> {
    this.logger.verbose(`Getting user: ${user.id} followers`);
    return this.authService.getFollowers(user);
  }

  @Get('/:id/getfollowing')
  @UseGuards(AuthGuard())
  getFollowing(@GetUser() user: User): Promise<User[]> {
    this.logger.verbose(`Getting user: ${user.id} followings`);
    return this.authService.getFollowing(user);
  }

  // Post request to populate db with 4 user
  @Post('/signupmulti')
  async signupmulti(): Promise<User[]> {
    const signupauthdto1 = {
      username: 'Jhon',
      email: 'jhon1@gmail.com',
      password: '123456',
    };
    const user1 = await this.authService.signup(signupauthdto1);
    const signupauthdto2 = {
      username: 'Jhon',
      email: 'jhon2@gmail.com',
      password: '123456',
    };
    const user2 = await this.authService.signup(signupauthdto2);
    const signupauthdto3 = {
      username: 'Jhon',
      email: 'jhon3@gmail.com',
      password: '123456',
    };
    const user3 = await this.authService.signup(signupauthdto3);
    const signupauthdto4 = {
      username: 'Jhon',
      email: 'jhon4@gmail.com',
      password: '123456',
    };
    const user4 = await this.authService.signup(signupauthdto4);
    return [user1, user2, user3, user4];
  }
}
