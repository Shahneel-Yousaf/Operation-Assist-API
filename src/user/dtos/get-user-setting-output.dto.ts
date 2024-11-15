import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetUserSettingOutput {
  @ApiPropertyOptional()
  @Expose()
  reportNotification: boolean;

  @ApiPropertyOptional()
  @Expose()
  inspectionNotification: boolean;

  @ApiProperty()
  @Expose()
  suppressDataUsagePopup: boolean;
}
