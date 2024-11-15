import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ListPartTypeTemplateOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  partTypeId: string;

  @ApiProperty()
  @Expose()
  partTypeCode: string;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  partTypeName: string;
}
