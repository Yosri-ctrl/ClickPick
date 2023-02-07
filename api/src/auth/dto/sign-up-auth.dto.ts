import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpAuthDto {
  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'password must be string' })
  @MinLength(4)
  @MaxLength(12)
  username: string;

  @IsNotEmpty({ message: 'email must not be empty' })
  @IsString({ message: 'password must be string' })
  email: string;

  @IsNotEmpty({ message: 'password must not be empty' })
  @IsString({ message: 'password must be string' })
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
