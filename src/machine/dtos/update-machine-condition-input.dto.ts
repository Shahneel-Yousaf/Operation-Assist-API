import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, GroupMachineCondition } from '@shared/constants';
import { IsEnum, IsString } from 'class-validator';

export class UpdateMachineConditionInput {
  @ApiProperty(defaultExamples.machineCondition)
  @IsEnum(GroupMachineCondition)
  @IsString()
  machineCondition: GroupMachineCondition;
}
