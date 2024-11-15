import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActionType, defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class OilCoolantRefillExchangeBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  oilCoolantRefillExchangeId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  oilTypeId: string;

  @Expose()
  @ApiProperty()
  actionType: ActionType;

  @Expose()
  @ApiPropertyOptional({ nullable: true })
  fluidInLiters: number;

  @Expose()
  @ApiPropertyOptional()
  comment: string;

  @Expose()
  @ApiProperty()
  oilTypeName: string;
}
