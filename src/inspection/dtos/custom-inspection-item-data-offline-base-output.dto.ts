import { ApiProperty } from '@nestjs/swagger';
import {
  CustomInspectionItemResultType,
  defaultExamples,
} from '@shared/constants';
import { Expose } from 'class-transformer';

export class CustomInspectionItemDataOfflineBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionFormId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionItemId: string;

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
  resultType: CustomInspectionItemResultType;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.isRequired)
  isRequired: boolean;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.isImmutable)
  isImmutable: boolean;

  @Expose()
  @ApiProperty(defaultExamples.inspectionItemOutput.isForcedRequired)
  isForcedRequired: boolean;

  @Expose()
  @ApiProperty()
  position: number;

  @Expose()
  @ApiProperty()
  lastStatusUpdatedAt: Date;
}
