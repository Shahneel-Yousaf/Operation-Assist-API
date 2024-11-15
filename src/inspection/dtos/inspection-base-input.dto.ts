import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  defaultExamples,
  DevicePlatform,
  InspectionCurrentStatus,
} from '@shared/constants';
import { TransformStringNumber } from '@shared/decorators';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
} from 'class-validator';

export class InspectionBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description:
      defaultExamples.CreateInspectionInput.inspectionFormId.description,
  })
  @Length(26, 26)
  @IsString()
  inspectionFormId: string;

  @ApiPropertyOptional(defaultExamples.CreateInspectionInput.lat)
  @IsNumber()
  @IsOptional()
  @Max(999.9999999)
  @TransformStringNumber()
  lat: number;

  @ApiPropertyOptional(defaultExamples.CreateInspectionInput.lng)
  @IsNumber()
  @IsOptional()
  @Max(999.9999999)
  @TransformStringNumber()
  lng: number;

  @ApiPropertyOptional(defaultExamples.CreateInspectionInput.locationAccuracy)
  @IsString()
  @Length(1, 32)
  @IsOptional()
  locationAccuracy: string;

  @ApiPropertyOptional({
    ...defaultExamples.devicePlatform,
    description:
      defaultExamples.CreateInspectionInput.devicePlatform.description,
  })
  @IsString()
  @IsEnum(DevicePlatform)
  @Length(1, 32)
  @IsOptional()
  devicePlatform: DevicePlatform;

  @ApiProperty(defaultExamples.CreateInspectionInput.currentStatus)
  @IsString()
  @IsEnum(InspectionCurrentStatus)
  @Length(1, 128)
  currentStatus: InspectionCurrentStatus;
}
