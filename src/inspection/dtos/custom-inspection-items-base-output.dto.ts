import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose } from 'class-transformer';

export class CustomInspectionItemsBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  customInspectionItemId: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  position: number;
}
