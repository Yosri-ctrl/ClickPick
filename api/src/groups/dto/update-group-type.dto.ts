import { IsEnum, IsNotEmpty } from 'class-validator';
import { groupTypes } from '../group.entity';

export class UpdateGroupTypeDto {
  @IsNotEmpty()
  @IsEnum(groupTypes)
  type: groupTypes;
}
