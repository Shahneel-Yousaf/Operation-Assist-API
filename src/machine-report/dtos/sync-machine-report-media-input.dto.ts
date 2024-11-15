import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples } from '@shared/constants';
import { IsString, Length } from 'class-validator';

import { MachineReportMediaInput } from '.';

export class SyncMachineReportMediaInput extends MachineReportMediaInput {
  @ApiProperty({
    ...defaultExamples.entityId,
    description: 'machineReportMediaId',
  })
  @Length(26, 26)
  @IsString()
  machineReportMediaId: string;
}
