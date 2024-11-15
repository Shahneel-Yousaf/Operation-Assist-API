import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class FuelRefillBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty()
  fuelInLiters: number;

  @Expose()
  @ApiProperty()
  isAdblueRefilled: boolean;

  @Expose()
  @ApiPropertyOptional()
  comment: string;
}
