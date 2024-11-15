import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, DevicePlatform } from '@shared/constants';
import { Expose } from 'class-transformer';

export class FuelMaintenanceReportLocationOutput {
  @Expose()
  @ApiPropertyOptional()
  lat: string;

  @Expose()
  @ApiPropertyOptional()
  lng: string;

  @Expose()
  @ApiPropertyOptional()
  locationAccuracy: string;

  @Expose()
  @ApiPropertyOptional(defaultExamples.devicePlatform)
  devicePlatform: DevicePlatform;
}
