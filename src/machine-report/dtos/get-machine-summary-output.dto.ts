import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  MachineReportResponseStatus,
  MachineSummaryType,
} from '@shared/constants';
import { Expose } from 'class-transformer';

export class GetMachineSummaryOutput {
  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.reportedId)
  reportedId: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  reportedAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.reportType)
  reportType: MachineSummaryType;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.reportTypeMessage)
  reportTypeMessage: string;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.reportSubType)
  reportSubType: string;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.reportItem)
  reportItem: string;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.reportResponseStatus)
  reportResponseStatus: MachineReportResponseStatus;

  @Expose()
  @ApiProperty()
  serviceMeter: number;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.givenName)
  givenName: string;

  @Expose()
  @ApiProperty(defaultExamples.getMachineSummaryOutput.surname)
  surname: string;

  @Expose()
  @ApiProperty({ nullable: true })
  userPictureUrl: string;

  @Expose()
  @ApiPropertyOptional(defaultExamples.getMachineSummaryOutput.lat)
  lat: number;

  @Expose()
  @ApiPropertyOptional(defaultExamples.getMachineSummaryOutput.lng)
  lng: number;

  @Expose()
  @ApiPropertyOptional(defaultExamples.dateTime)
  firstReportedAt: Date;
}
