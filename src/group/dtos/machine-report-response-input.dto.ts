import { MachineReportBaseInput } from '@machine-report/dtos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineReportResponseStatus,
} from '@shared/constants';
import { IsArrayUnique } from '@shared/validations';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class MachineReportResponseInput extends MachineReportBaseInput {
  @ApiPropertyOptional(defaultExamples.reportActionChoiceIds)
  @IsArrayUnique()
  @IsArray()
  @IsString({ each: true })
  @Length(26, 26, { each: true })
  @IsOptional()
  reportActionChoiceIds: string[];

  @ApiPropertyOptional({
    ...defaultExamples.machineReportResponseStatus,
  })
  @IsEnum(MachineReportResponseStatus)
  @IsOptional()
  status: MachineReportResponseStatus;
}
