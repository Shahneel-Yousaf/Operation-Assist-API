import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MaintenanceReasonPeriodChoiceOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  maintenanceReasonPeriodChoiceId: string;

  @ApiProperty()
  @Expose()
  maintenanceReasonPeriodChoiceCode: string;

  @ApiProperty()
  @Expose()
  position: number;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  maintenanceReasonPeriodChoiceName: string;
}
