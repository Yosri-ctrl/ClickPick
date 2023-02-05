import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
import { UpdateUserPassDto } from './dto/update-user-pass.dto';

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
      if (err.code == 23505) {
        throw new ConflictException('User name already exists');
      }
      this.logger.error(`Error Signing up the user: ${email}`);
      throw new InternalServerErrorException(`${err}`);
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

  async getOneUser(id: string): Promise<User> {
    const user: User = await this.authRepository.findOneBy({ id });
    if (!user) {
      this.logger.error(`User: ${id} not found`);
      throw new UnauthorizedException();
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const query = this.authRepository.createQueryBuilder('user');
    const users = await query.getMany();

    if (!users) {
      this.logger.error(`Couldn't find users`);
      throw new UnauthorizedException();
    }

    return users;
  }

  async updateUserUsername(id: string, username: string): Promise<User> {
    const user = await this.getOneUser(id);
    user.username = username;
    await this.authRepository.save(user);
    return user;
  }

  async updaetUserPass(
    id: string,
    updaetUserPassDto: UpdateUserPassDto,
  ): Promise<User> {
    const { newpass, oldpass } = updaetUserPassDto;
    const user = await this.getOneUser(id);
    if (!(await bcrypt.compare(oldpass, user.password))) {
      this.logger.error('Unauthrized credentials');
      throw new UnauthorizedException();
    }

    const salt = await bcrypt.genSalt();
    const hashpass = await bcrypt.hash(newpass, salt);

    user.password = hashpass;
    await this.authRepository.save(user);

    return user;
  }
}
