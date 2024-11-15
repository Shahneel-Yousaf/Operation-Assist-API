import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class ListOilTypeTemplateOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  oilTypeId: string;

  @ApiProperty()
  @Expose()
  oilTypeCode: string;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  oilTypeName: string;
}
