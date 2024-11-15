import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateUserSettingOutput {
  @ApiPropertyOptional()
  @Expose()
  reportNotification: boolean;

  @ApiPropertyOptional()
  @Expose()
  inspectionNotification: boolean;

  @ApiPropertyOptional()
  @Expose()
  suppressDataUsagePopup: boolean;
}
