import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { CustomInspectionOutput } from '.';
import { CustomInspectionItemsBaseOutput } from './custom-inspection-items-base-output.dto';

export class GetInspectionsForWebappOutput {
  @ApiProperty()
  @Expose()
  @Type(() => CustomInspectionItemsBaseOutput)
  customInspectionItems: CustomInspectionItemsBaseOutput[];

  @ApiProperty()
  @Expose()
  @Type(() => CustomInspectionOutput)
  customInspections: CustomInspectionOutput[];
}
