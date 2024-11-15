import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ScreenPermissionResponse {
  @ApiProperty()
  @Expose()
  allowEditDeleteGroup?: boolean = false;

  @ApiProperty()
  @Expose()
  allowCreateEditDeleteMachine?: boolean = false;

  @ApiProperty()
  @Expose()
  allowCreateEditDeleteMember?: boolean = false;

  @ApiProperty()
  @Expose()
  allowCreateEditDeleteInspectionForm?: boolean = false;

  @ApiProperty()
  @Expose()
  allowCreateInspectionAndReport?: boolean = false;
}
