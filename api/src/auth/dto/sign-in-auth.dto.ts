import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInAuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  password: string;
}
