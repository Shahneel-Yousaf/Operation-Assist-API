import { GroupMachineParam } from '@group/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupMachineInspectionParam extends GroupMachineParam {
  @ApiProperty()
  @IsString()
  inspectionId: string;
}
