import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDate,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { InspectionBaseInput, SyncInspectionResultInput } from '.';

export class SyncInspectionDataInput extends InspectionBaseInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'inspectionId',
  })
  @Length(26, 26)
  @IsString()
  inspectionId: string;

  @ApiProperty({ type: () => SyncInspectionResultInput, isArray: true })
  @Type(() => SyncInspectionResultInput)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  inspectionItems: SyncInspectionResultInput[];

  @ApiProperty(defaultExamples.dateTime)
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  lastStatusUpdatedAt: Date;
}
