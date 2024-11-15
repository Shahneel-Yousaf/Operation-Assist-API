import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MaintenanceReasonChoiceOutput {
  @ApiProperty(defaultExamples.entityId)
  @Expose()
  maintenanceReasonChoiceId: string;

  @ApiPropertyOptional()
  @Expose()
  isPeriodSelection: boolean;

  @ApiProperty()
  @Expose()
  maintenanceReasonChoiceCode: string;

  @ApiProperty()
  @Expose()
  position: number;

  @ApiProperty()
  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @ApiProperty()
  @Expose()
  maintenanceReasonChoiceName: string;
}
