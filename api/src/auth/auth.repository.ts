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
        this.logger.error(`Email already exists email: ${email}`);
        throw new ConflictException('Email already exists');
      }
      this.logger.error(`Error Signing up the user: ${email}`, '');
      throw new InternalServerErrorException(err.message);
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
        this.logger.error(`User: ${id} not found`, '');
        throw new UnauthorizedException(`User: ${id} not found`);
      }
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
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

  async updateUserUsername(user: User, username: string): Promise<User> {
    user.username = username;
    await this.authRepository.save(user);

    return user;
  }

  async updaetUserPass(
    user: User,
    updaetUserPassDto: UpdateUserPassDto,
  ): Promise<User> {
    const { newpass, oldpass } = updaetUserPassDto;
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

  async deleteUser(user: User): Promise<void> {
    const res = await this.authRepository.delete(user.id);

    if (res.affected == 0) {
      this.logger.error(`Failed delete user: "${user.id}"`);
      throw new NotFoundException(`User with ${user.id} not found`);
    }
  }

  async getUserWithRelation(id: string, relation: string): Promise<User[]> {
    try {
      let user: User[];
      if (relation == 'following') {
        user = await this.authRepository.find({
          relations: { following: true },
          where: { id },
        });
      }
      if (relation == 'followers') {
        user = await this.authRepository.find({
          relations: { followers: true },
          where: { id },
        });
      }
      if (user.length == 0) {
        throw new UnauthorizedException({ message: `User: ${id} not found` });
      }
      return user;
    } catch (err) {
      if (err.status == 401) {
        this.logger.error(`User: ${id} not found`, '');
        throw new UnauthorizedException(`User: ${id} not found`, '');
      }
      this.logger.error(`${err.message}`, '');
      throw new InternalServerErrorException(err.message);
    }
  }

  async followUser(user: User, id2: string): Promise<void> {
    if (user.id == id2) {
      this.logger.error(`User can't be the same`);
      throw new ConflictException(`User can't be the same`);
    }

    const user1 = await this.getUserWithRelation(user.id, 'following');
    const user2 = await this.getOneUser(id2);

    if (user1[0].following.find((u) => u.id == id2)) {
      this.logger.error(`User: ${user.id} already following ${id2}`, '');
      throw new ConflictException(`User: ${user.id} already following ${id2}`);
    }
    user1[0].following.push(user2);

    await this.authRepository.save(user1);
  }

  async unfollowUser(user: User, id: string): Promise<void> {
    if (user.id == id) {
      this.logger.error(`User can't be the same`);
      throw new ConflictException(`User can't be the same`);
    }

    const user1 = await this.getUserWithRelation(user.id, 'following');
    const user2 = await this.getOneUser(id);

    if (!user1[0].following.find((u) => u.id == id)) {
      this.logger.error(`User: ${user.id} is not following ${id}`, '');
      throw new ConflictException(`User: ${user.id} is not following ${id}`);
    }

    user1[0].following.splice(user1[0].following.indexOf(user2), 1);

    await this.authRepository.save(user1);
  }

  async getFollowers(id: string): Promise<User[]> {
    const user1 = await this.getUserWithRelation(id, 'followers');
    return user1[0].followers;
  }

  async getFollowing(id: string): Promise<User[]> {
    const user1 = await this.getUserWithRelation(id, 'following');
    return user1[0].following;
  }
}
