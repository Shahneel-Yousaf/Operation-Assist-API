import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { InspectionItemMediaOutput } from '.';

export class InspectionItemOutput {
  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description:
      defaultExamples.inspectionItemOutput.inspectionItemId.description,
  })
  inspectionItemId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.name)
  name: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.description)
  description: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.itemCode)
  itemCode: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.resultType)
  resultType: string;

  @Expose()
  @ApiPropertyOptional(defaultExamples.inspectionItemOutput.isRequired)
  isRequired: boolean;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.isImmutable)
  isImmutable: boolean;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.isForcedRequired)
  isForcedRequired: boolean;

  @Expose()
  @ApiPropertyOptional({
    type: () => InspectionItemMediaOutput,
    isArray: true,
    nullable: true,
  })
  @Type(() => InspectionItemMediaOutput)
  inspectionItemMedias: InspectionItemMediaOutput[];
}
