import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineReportResponseStatus,
  MachineReportType,
} from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { ReportActionOutput } from '.';

export class GetMachineReportsForWebappOutput {
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
  @ApiProperty(defaultExamples.reportType)
  reportType: MachineReportType;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  reportedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  firstReportedAt: Date;

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
  @ApiProperty()
  reportResponseStatus: MachineReportResponseStatus;

  @Expose()
  @ApiProperty(defaultExamples.timeSinceCommentCreation)
  timeSinceCommentCreation: string;

  @ApiProperty({
    type: () => ReportActionOutput,
    isArray: true,
  })
  @Expose()
  @Type(() => ReportActionOutput)
  reportActions: ReportActionOutput[];

  @Expose()
  @ApiPropertyOptional()
  lat: number;

  @Expose()
  @ApiPropertyOptional()
  lng: number;

  @Expose()
  @ApiPropertyOptional()
  isRead: boolean;
}
