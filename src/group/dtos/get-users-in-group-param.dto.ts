import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUsersInGroupParamDto {
  @ApiProperty()
  @IsString()
  groupId: string;
}
