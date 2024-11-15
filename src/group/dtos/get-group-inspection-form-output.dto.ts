import { ApiProperty } from '@nestjs/swagger';
import { CustomInspectionFormCurrentStatus } from '@shared/constants';
import { Expose } from 'class-transformer';

export class GetGroupInspectionFormOutput {
  @Expose()
  @ApiProperty()
  machineId: string;

  @Expose()
  @ApiProperty()
  inspectionFormId: string;

  @Expose()
  @ApiProperty()
  machinePictureUrl: string;

  @Expose()
  @ApiProperty()
  machineName: string;

  @Expose()
  @ApiProperty()
  inspectionFormName: string;

  @Expose()
  @ApiProperty()
  currentStatus: CustomInspectionFormCurrentStatus;

  @Expose()
  @ApiProperty()
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  userPictureUrl: string;
}
