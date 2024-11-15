import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { GroupParam } from './group-param.dto';

export class GroupMachineParam extends GroupParam {
  @ApiProperty()
  @IsString()
  machineId: string;
}
