import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { GroupParam } from './group-param.dto';

export class GroupUserParam extends GroupParam {
  @ApiProperty()
  @IsString()
  userId: string;
}
