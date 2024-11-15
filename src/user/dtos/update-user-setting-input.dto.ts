import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSettingInput {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  reportNotification: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  inspectionNotification: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  suppressDataUsagePopup: boolean;
}
