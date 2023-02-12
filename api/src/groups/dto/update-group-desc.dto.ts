import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupDescDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}
