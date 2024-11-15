import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class RegularMaintenanceItemChoiceOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  regularMaintenanceItemChoiceId: string;

  @ApiProperty()
  @Expose()
  regularMaintenanceItemChoiceCode: string;

  @ApiProperty()
  @Expose()
  position: number;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  regularMaintenanceItemChoiceName: string;
}
