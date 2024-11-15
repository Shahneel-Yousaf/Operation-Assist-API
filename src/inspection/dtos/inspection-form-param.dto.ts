import { GroupMachineParam } from '@group/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InspectionFormParam extends GroupMachineParam {
  @ApiProperty()
  @IsString()
  customInspectionFormId: string;
}
