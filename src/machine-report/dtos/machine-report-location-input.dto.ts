import { ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples, DevicePlatform } from '@shared/constants';
import { TransformStringNumber } from '@shared/decorators';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
} from 'class-validator';

export class MachineReportLocationInput {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Max(999.9999999)
  @TransformStringNumber()
  lat: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Max(999.9999999)
  @TransformStringNumber()
  lng: number;

  @ApiPropertyOptional()
  @IsString()
  @Length(1, 32)
  @IsOptional()
  locationAccuracy: string;

  @ApiPropertyOptional(defaultExamples.devicePlatform)
  @IsString()
  @IsEnum(DevicePlatform)
  @Length(1, 32)
  @IsOptional()
  devicePlatform: DevicePlatform;
}
