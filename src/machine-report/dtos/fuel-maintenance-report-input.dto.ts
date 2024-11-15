import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { TransformStringNumber } from '@shared/decorators';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  Max,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import {
  MachineReportLocationInput,
  OilCoolantRefillExchangeBaseInput,
  PartReplacementBaseInput,
} from '.';
import { FuelRefillBaseInput } from './fuel-refill-base-input.dto';

export class FuelMaintenanceReportInput extends MachineReportLocationInput {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Max(9999999.9)
  @TransformStringNumber()
  @ValidateIf((_obj, value) => value !== null)
  serviceMeterInHour: number | null;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  workAt: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FuelRefillBaseInput)
  fuelRefill: FuelRefillBaseInput;

  @ApiPropertyOptional(defaultExamples.oilCoolantRefillExchanges)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  @Type(() => OilCoolantRefillExchangeBaseInput)
  oilCoolantRefillExchanges: OilCoolantRefillExchangeBaseInput[];

  @ApiPropertyOptional(defaultExamples.partReplacements)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(5)
  @Type(() => PartReplacementBaseInput)
  partReplacements: PartReplacementBaseInput[];
}
