import { IsNotEmpty } from 'class-validator';

export class CreatePickDto {
  @IsNotEmpty()
  content: string;
}
