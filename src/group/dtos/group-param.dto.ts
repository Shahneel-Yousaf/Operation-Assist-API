import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupParam {
  @ApiProperty()
  @IsString()
  groupId: string;
}
