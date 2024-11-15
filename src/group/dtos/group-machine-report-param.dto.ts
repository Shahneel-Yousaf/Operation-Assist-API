import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { GroupMachineParam } from '.';

export class GroupMachineReportParam extends GroupMachineParam {
  @ApiProperty()
  @IsString()
  machineReportId: string;
}
