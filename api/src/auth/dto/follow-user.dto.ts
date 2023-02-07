import { IsNotEmpty, IsString } from 'class-validator';

export class FollowUserDto {
  @IsNotEmpty()
  @IsString()
  id1: string;

  @IsNotEmpty()
  @IsString()
  id2: string;
}
