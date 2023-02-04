import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpAuthDto } from './dto/sign-up-auth.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtInterface } from './interface/auth.interface';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('Auth repository');

  async signup(signupauthdto: SignUpAuthDto): Promise<User> {
    const { username, email, password } = signupauthdto;

    const salt = await bcrypt.genSalt();
    const hashpass = await bcrypt.hash(password, salt);

    const user: User = this.authRepository.create({
      username,
      email,
      password: hashpass,
    });

    try {
      await this.authRepository.save(user);
      return user;
    } catch (err) {
      this.logger.error(`Error Signing up the user: ${username}`);
      throw new InternalServerErrorException();
    }
  }

  async signin(singInAuthDto: SignInAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = singInAuthDto;

    const user = await this.authRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const playload: AuthJwtInterface = { email };
      const accessToken: string = await this.jwtService.sign(playload);
      return { accessToken };
    } else {
      this.logger.error(`User with email: ${email} not found`);
      throw new UnauthorizedException();
    }
  }
}
