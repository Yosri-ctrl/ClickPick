import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePickDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}
