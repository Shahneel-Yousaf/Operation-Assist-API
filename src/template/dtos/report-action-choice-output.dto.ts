import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ReportActionChoiceOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  reportActionChoiceId: string;

  @ApiProperty()
  @Expose()
  reportActionChoiceCode: string;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  reportActionChoiceName: string;
}
