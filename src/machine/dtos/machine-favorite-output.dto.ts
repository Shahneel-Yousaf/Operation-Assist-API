import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, MachineFavoriteResponse } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class MachineFavoriteOutput {
  @Expose()
  @ApiPropertyOptional(defaultExamples.machineFavorite)
  @IsEnum(MachineFavoriteResponse)
  @IsOptional()
  status: MachineFavoriteResponse;
}
