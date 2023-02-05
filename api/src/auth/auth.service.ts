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
}
