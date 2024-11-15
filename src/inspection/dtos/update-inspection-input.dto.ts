import { ApiProperty } from '@nestjs/swagger';
import {} from '@shared/constants';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { InspectionBaseInput, InspectionResultUpdate } from '.';

export class UpdateInspectionInput extends InspectionBaseInput {
  @ApiProperty({ type: () => InspectionResultUpdate, isArray: true })
  @Type(() => InspectionResultUpdate)
  @ValidateNested({ each: true })
  inspectionItems: InspectionResultUpdate[];
}
