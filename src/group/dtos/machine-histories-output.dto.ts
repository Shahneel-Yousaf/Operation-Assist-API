import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, MachineHistoryType } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class MachineHistoriesOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  machineHistoryId: string;

  @Expose()
  @ApiProperty({
    description:
      'Machine histories type: machine report, inspection, inspection form',
    example: MachineHistoryType.MACHINE_REPORTS,
    enum: MachineHistoryType,
  })
  @IsEnum(MachineHistoryType)
  machineHistoryType: MachineHistoryType;

  @Expose()
  @ApiProperty()
  updateContent: string;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  eventAt: Date;
}
