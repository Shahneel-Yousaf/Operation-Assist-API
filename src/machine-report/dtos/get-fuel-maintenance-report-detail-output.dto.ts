import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, Subtype } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import {
  FuelMaintenanceReportLocationOutput,
  FuelRefillBaseOutput,
  OilCoolantRefillExchangeBaseOutput,
  PartReplacementBaseOutput,
} from '.';

export class GetFuelMaintenanceReportDetailOutput extends FuelMaintenanceReportLocationOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportId: string;

  @ApiProperty(defaultExamples.dateTime)
  @Expose()
  reportedAt: Date;

  @Expose()
  @ApiProperty()
  reportTitle: string;

  @ApiProperty(defaultExamples.subtype)
  @Expose()
  subtype: Subtype;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @ApiProperty()
  @Expose()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty({ nullable: true })
  userPictureUrl: string;

  @ApiProperty(defaultExamples.entityId)
  @Expose()
  machineReportResponseId: string;

  @Expose()
  @ApiProperty(defaultExamples.timeSinceCommentCreation)
  timeSinceCommentCreation: string;

  @ApiProperty(defaultExamples.dateTime)
  @Expose()
  workAt: Date;

  @Expose()
  @ApiPropertyOptional({ nullable: true })
  serviceMeterInHour: number;

  @ApiPropertyOptional({ type: () => FuelRefillBaseOutput })
  @Expose()
  @Type(() => FuelRefillBaseOutput)
  fuelRefill: FuelRefillBaseOutput;

  @ApiPropertyOptional({ type: () => OilCoolantRefillExchangeBaseOutput })
  @Type(() => OilCoolantRefillExchangeBaseOutput)
  @Expose()
  oilCoolantRefillExchanges: OilCoolantRefillExchangeBaseOutput[];

  @Expose()
  @ApiPropertyOptional({ type: () => PartReplacementBaseOutput })
  @Type(() => PartReplacementBaseOutput)
  partReplacements: PartReplacementBaseOutput[];
}
