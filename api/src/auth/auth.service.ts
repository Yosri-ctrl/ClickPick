import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { UpdateUserPassDto } from './dto/update-user-pass.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  signup(signupauthdto: SignUpAuthDto): Promise<User> {
    return this.authRepository.signup(signupauthdto);
  }

  signin(singInAuthDto: SignInAuthDto): Promise<{ accessToken: string }> {
    return this.authRepository.signin(singInAuthDto);
  }

  getOneUser(id: string): Promise<User> {
    return this.authRepository.getOneUser(id);
  }

  getAllUser(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }

  updateUserUsername(user: User, username: string): Promise<User> {
    return this.authRepository.updateUserUsername(user, username);
  }

  updateUserPass(
    user: User,
    updateUserPassDto: UpdateUserPassDto,
  ): Promise<User> {
    return this.authRepository.updaetUserPass(user, updateUserPassDto);
  }

  deleteUser(user: User): Promise<void> {
    return this.authRepository.deleteUser(user);
  }

  followUser(user, id): Promise<void> {
    return this.authRepository.followUser(user, id);
  }

  unfollowUser(user, id): Promise<void> {
    return this.authRepository.unfollowUser(user, id);
  }

  getFollowers(id: string): Promise<User[]> {
    return this.authRepository.getFollowers(id);
  }

  getFollowing(id: string): Promise<User[]> {
    return this.authRepository.getFollowing(id);
  }
}
