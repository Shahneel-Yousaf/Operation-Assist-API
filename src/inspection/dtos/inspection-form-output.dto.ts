import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CustomInspectionFormCurrentStatus,
  defaultExamples,
  InspectionFormType,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { InspectionItemOutput } from '.';

export class InspectionFormOutput {
  @Expose()
  @ApiProperty({
    ...defaultExamples.entityId,
    description:
      defaultExamples.inspectionFormOutput.inspectionFormId.description,
  })
  inspectionFormId: string;

  @Expose()
  @IsEnum(InspectionFormType)
  @ApiProperty(defaultExamples.inspectionFormOutput.type)
  type: InspectionFormType;

  @Expose()
  @ApiProperty(defaultExamples.inspectionFormOutput.name)
  name: string;

  @Expose()
  @ApiPropertyOptional(defaultExamples.inspectionFormOutput.currentStatus)
  @IsEnum([
    CustomInspectionFormCurrentStatus.DRAFT,
    CustomInspectionFormCurrentStatus.PUBLISHED,
  ])
  currentStatus: CustomInspectionFormCurrentStatus;

  @Expose()
  @ApiProperty({ type: () => InspectionItemOutput, isArray: true })
  @Type(() => InspectionItemOutput)
  inspectionItems: InspectionItemOutput;
}
