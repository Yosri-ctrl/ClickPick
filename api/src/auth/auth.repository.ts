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
import { FollowUserDto } from './dto/follow-user.dto';

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
        this.logger.error(`Email already exists email: ${email}`);
        throw new ConflictException('Email already exists');
      }
      this.logger.error(`Error Signing up the user: ${email}`, '');
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
    try {
      const user: User = await this.authRepository.findOneBy({ id });
      if (!user) {
        this.logger.error(`User: ${id} not found`);
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
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

  async deleteUser(id: string): Promise<void> {
    const res = await this.authRepository.delete({ id });

    if (res.affected == 0) {
      this.logger.error(`Failed delete user: "${id}"`);
      throw new NotFoundException(`User with ${id} not found`);
    }
  }

  async followUser(followUserDto: FollowUserDto): Promise<void> {
    const { id1, id2 } = followUserDto;
    if (id1 == id2) {
      this.logger.error(`User can't be the same`);
      throw new ConflictException(`User can't be the same`);
    }

    const user2 = await this.getOneUser(id2);
    const user1 = await this.authRepository.find({
      relations: {
        following: true,
      },
      where: {
        id: id1,
      },
    });

    if (user1[0].following.find((u) => u.id == id2)) {
      this.logger.error(`User: ${id1} already following ${id2}`);
      throw new ConflictException(`User: ${id1} already following ${id2}`);
    }
    user1[0].following.push(user2);

    await this.authRepository.save(user1);
  }

  // Fixing this
  async unfollowUser(followUserDto: FollowUserDto): Promise<void> {
    const { id1, id2 } = followUserDto;
    const user1 = await this.getOneUser(id1);
    const user2 = await this.getOneUser(id2);

    // if (!user1.following.includes(id2)) {
    //   this.logger.error(`User: "${id1}" is not following user: "${id2}"`);
    //   throw new ConflictException(`User: ${id1} is not following user: ${id2}`);
    // }

    // user1.following.splice(user1.following.indexOf(user2.id), 1);
    // user2.followers.splice(user2.followers.indexOf(user1.id), 1);

    await this.authRepository.save(user1);
    await this.authRepository.save(user2);
  }
  //Implementing get all followers for a user
  //Implementing get all following for a user
}
