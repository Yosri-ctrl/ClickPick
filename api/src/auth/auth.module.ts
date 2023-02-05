import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt-strategy';

@Module({
  providers: [AuthService, AuthRepository, JWTStrategy],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.TYPEORM_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  exports: [JWTStrategy, PassportModule],
})
export class AuthModule {}
