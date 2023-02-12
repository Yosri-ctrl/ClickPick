import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGroupTitleDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
