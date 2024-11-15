import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import {
  IrregularMaintenanceItemChoiceOutput,
  MaintenanceReasonChoiceOutput,
  MaintenanceReasonPeriodChoiceOutput,
  RegularMaintenanceItemChoiceOutput,
} from '.';

export class ListMaintenanceReportTemplateOutput {
  @ApiProperty({
    type: () => RegularMaintenanceItemChoiceOutput,
    isArray: true,
  })
  @Expose()
  @Type(() => RegularMaintenanceItemChoiceOutput)
  regularMaintenanceItemChoiceTemplates: RegularMaintenanceItemChoiceOutput[];

  @ApiProperty({
    type: () => IrregularMaintenanceItemChoiceOutput,
    isArray: true,
  })
  @Expose()
  @Type(() => IrregularMaintenanceItemChoiceOutput)
  irregularMaintenanceItemChoiceTemplates: IrregularMaintenanceItemChoiceOutput[];

  @ApiProperty({
    type: () => MaintenanceReasonChoiceOutput,
    isArray: true,
  })
  @Expose()
  @Type(() => MaintenanceReasonChoiceOutput)
  maintenanceReasonChoiceTemplates: MaintenanceReasonChoiceOutput[];

  @ApiProperty({
    type: () => MaintenanceReasonPeriodChoiceOutput,
    isArray: true,
  })
  @Expose()
  @Type(() => MaintenanceReasonPeriodChoiceOutput)
  maintenanceReasonPeriodChoiceTemplates: MaintenanceReasonPeriodChoiceOutput[];
}
