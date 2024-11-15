import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class MachineHistoryOutputDto {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineHistoryId: string;

  @Expose()
  @ApiProperty()
  machineHistoryType: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  eventAt: Date;

  @Expose()
  @ApiProperty()
  currentStatus: string;

  @Expose()
  @ApiProperty()
  inspectionFormName: string;

  @Expose()
  @ApiProperty()
  subtype: string;

  @Expose()
  @ApiProperty()
  status: string;
}
