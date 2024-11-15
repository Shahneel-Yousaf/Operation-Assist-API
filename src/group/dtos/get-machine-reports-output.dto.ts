import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineReportType,
} from '@shared/constants';
import { Expose } from 'class-transformer';

export class GetMachineReportsOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty({ nullable: true })
  userPictureUrl: string;

  @Expose()
  @ApiProperty({ nullable: true })
  filePath: string;

  @Expose()
  @ApiProperty(defaultExamples.reportType)
  reportType: MachineReportType;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  reportedAt: Date;

  @Expose()
  @ApiProperty()
  reportTitle: string;

  @Expose()
  @ApiPropertyOptional({ nullable: true })
  firstReportComment: string;

  @Expose()
  @ApiProperty()
  reportCommentId: string;

  @Expose()
  @ApiProperty(defaultExamples.machineReportStatus)
  reportStatus: MachineReportCurrentStatus;

  @Expose()
  @ApiProperty()
  isRead: boolean;

  @Expose()
  @ApiProperty()
  reportResponseStatus: MachineReportResponseStatus;

  @Expose()
  @ApiProperty(defaultExamples.timeSinceCommentCreation)
  timeSinceCommentCreation: string;

  @Expose()
  @ApiProperty({ nullable: true })
  serviceMeterInHour: number;
}
