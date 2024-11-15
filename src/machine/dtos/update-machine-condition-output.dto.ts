import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, GroupMachineCondition } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateMachineConditionOutput {
  @Expose()
  @ApiPropertyOptional(defaultExamples.machineCondition)
  @IsOptional()
  @IsEnum(GroupMachineCondition)
  machineCondition: GroupMachineCondition;
}
