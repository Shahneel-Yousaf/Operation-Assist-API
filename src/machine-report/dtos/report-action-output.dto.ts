import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ReportActionChoiceCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ReportActionOutput {
  @Expose()
  @ApiProperty()
  reportActionName: string;

  @Expose()
  @ApiProperty(defaultExamples.reportActionCode)
  reportActionCode: ReportActionChoiceCode;
}
