import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpAuthDto {
  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
