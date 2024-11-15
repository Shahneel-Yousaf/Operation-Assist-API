import { MachineReportMediaOutput } from '@machine/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import {
  IrregularMaintenanceItemChoiceOutput,
  MaintenanceReasonChoiceOutput,
  MaintenanceReasonPeriodChoiceOutput,
  RegularMaintenanceItemChoiceOutput,
} from '@template/dtos';
import { Expose, Type } from 'class-transformer';

export class GetMaintenanceReportDetailOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  reportedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty(defaultExamples.getMaintenanceReportDetailOutput.givenName)
  givenName: string;

  @Expose()
  @ApiProperty(defaultExamples.getMaintenanceReportDetailOutput.surname)
  surname: string;

  @Expose()
  @ApiPropertyOptional(
    defaultExamples.getMaintenanceReportDetailOutput.userPictureUrl,
  )
  userPictureUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.timeSinceCommentCreation)
  timeSinceCommentCreation: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  workAt: Date;

  @Expose()
  @ApiProperty(
    defaultExamples.getMaintenanceReportDetailOutput.serviceMeterInHour,
  )
  serviceMeterInHour: number;

  @Expose()
  @ApiProperty({
    type: () => IrregularMaintenanceItemChoiceOutput,
    isArray: true,
  })
  @Type(() => IrregularMaintenanceItemChoiceOutput)
  irregularMaintenanceItemChoices: IrregularMaintenanceItemChoiceOutput[];

  @Expose()
  @ApiProperty()
  @Type(() => RegularMaintenanceItemChoiceOutput)
  regularMaintenanceItemChoice: RegularMaintenanceItemChoiceOutput;

  @Expose()
  @ApiProperty()
  @Type(() => MaintenanceReasonChoiceOutput)
  maintenanceReasonChoice: MaintenanceReasonChoiceOutput;

  @Expose()
  @ApiPropertyOptional()
  @Type(() => MaintenanceReasonPeriodChoiceOutput)
  maintenanceReasonPeriodChoice: MaintenanceReasonPeriodChoiceOutput;

  @Expose()
  @ApiPropertyOptional({ type: () => [MachineReportMediaOutput] })
  @Type(() => MachineReportMediaOutput)
  machineReportMedias: MachineReportMediaOutput[];

  @Expose()
  @ApiProperty(defaultExamples.getMaintenanceReportDetailOutput.comment)
  comment: string;

  @Expose()
  @ApiPropertyOptional({ nullable: true })
  lat: number;

  @Expose()
  @ApiPropertyOptional({ nullable: true })
  lng: number;

  @Expose()
  @ApiPropertyOptional({ nullable: true })
  locationAccuracy: string;
}
