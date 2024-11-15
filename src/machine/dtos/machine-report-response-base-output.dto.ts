import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineReportResponseStatus,
  Subtype,
} from '@shared/constants';
import { ReportActionChoiceOutput } from '@template/dtos';
import { Expose, Type } from 'class-transformer';

import { MachineReportMediaOutput } from '.';

export class MachineReportResponseBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

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
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  commentedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.timeSinceCommentCreation)
  timeSinceCommentCreation: string;

  @Expose()
  @ApiProperty()
  reportComment: string;

  @Expose()
  @ApiProperty(defaultExamples.machineReportResponseStatus)
  reportResponseStatus: MachineReportResponseStatus;

  @Expose()
  @ApiProperty()
  isChangeStatus: boolean;

  @Expose()
  @ApiProperty({ type: () => ReportActionChoiceOutput, isArray: true })
  @Type(() => ReportActionChoiceOutput)
  reportActionChoices: ReportActionChoiceOutput[];

  @Expose()
  @ApiProperty({ type: () => MachineReportMediaOutput, isArray: true })
  @Type(() => MachineReportMediaOutput)
  machineReportMedias: MachineReportMediaOutput[];

  @Expose()
  @ApiProperty(defaultExamples.subtype)
  subtype: Subtype;

  @Expose()
  @ApiProperty({ nullable: true })
  serviceMeterInHour: number;
}
