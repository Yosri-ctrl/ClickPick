import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthJwtInterface } from './interface/auth.interface';
import { User } from './user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.TYPEORM_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(playload: AuthJwtInterface): Promise<User> {
    const { email } = playload;
    const user: User = await this.userEntityRepository.findOneBy({
      email: email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
