import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';

import { InspectionBaseInput, InspectionResultInput } from '.';

export class CreateInspectionInput extends InspectionBaseInput {
  @ApiProperty({ type: () => InspectionResultInput, isArray: true })
  @Type(() => InspectionResultInput)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  inspectionItems: InspectionResultInput[];
}
