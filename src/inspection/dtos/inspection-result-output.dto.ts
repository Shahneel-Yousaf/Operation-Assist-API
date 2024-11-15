import { MachineReportBaseOutput } from '@machine-report/dtos';
import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  InspectionCurrentStatus,
  InspectionResultType,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';

export class InspectionResultOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionResultId: string;

  @Expose()
  @ApiProperty(defaultExamples.inspectionResultType)
  result: InspectionResultType;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  inspectionId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionItemId: string;

  @Expose()
  @ApiProperty({
    enum: InspectionCurrentStatus,
    default: InspectionCurrentStatus.DRAFT,
  })
  currentStatus: InspectionCurrentStatus;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty({ nullable: true })
  itemCode: string;

  @Expose()
  @ApiProperty()
  customInspectionItemName: string;

  @Expose()
  @ApiProperty()
  position: number;

  @Expose()
  @ApiProperty({ type: () => MachineReportBaseOutput })
  @Type(() => MachineReportBaseOutput)
  machineReport: MachineReportBaseOutput;
}
