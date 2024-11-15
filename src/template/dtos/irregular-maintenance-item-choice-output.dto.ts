import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class IrregularMaintenanceItemChoiceOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  irregularMaintenanceItemChoiceId: string;

  @ApiProperty()
  @Expose()
  irregularMaintenanceItemChoiceCode: string;

  @ApiProperty()
  @Expose()
  position: number;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  irregularMaintenanceItemChoiceName: string;
}
