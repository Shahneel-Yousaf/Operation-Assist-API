import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CountMachineReport {
  @Expose()
  @ApiProperty()
  reportCount: string;

  @Expose()
  @ApiProperty()
  reportOpenCount: string;
}
