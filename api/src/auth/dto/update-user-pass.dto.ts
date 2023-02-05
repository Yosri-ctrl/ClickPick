import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserPassDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  oldpass: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  newpass: string;
}
