import { GroupMachineParam } from '@group/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupMachineInspectionItemTemplateParam extends GroupMachineParam {
  @ApiProperty()
  @IsString()
  inspectionFormTemplateId: string;
}
