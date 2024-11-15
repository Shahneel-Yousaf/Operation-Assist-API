import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { PartReplacementMediaBaseOutput } from '.';

export class PartReplacementBaseOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  partReplacementId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineReportResponseId: string;

  @Expose()
  @ApiProperty(defaultExamples.entityId)
  partTypeId: string;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  partTypeName: string;

  @Expose()
  @ApiProperty({ type: () => PartReplacementMediaBaseOutput })
  @Type(() => PartReplacementMediaBaseOutput)
  partReplacementMedias: PartReplacementMediaBaseOutput[];
}
