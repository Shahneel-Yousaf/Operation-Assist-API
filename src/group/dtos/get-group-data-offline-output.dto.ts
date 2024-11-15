import {
  CustomInspectionFormDataOfflineBaseOutput,
  CustomInspectionItemDataOfflineBaseOutput,
  CustomInspectionItemMediaDataOfflineBaseOutput,
} from '@inspection/dtos';
import { MachineDataOfflineBaseOutput } from '@machine/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose, Type } from 'class-transformer';

import { GroupDataOfflineBaseOutput } from '.';

export class GetGroupDataOfflineOutput {
  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty()
  pictureUrl: string;

  @Expose()
  @ApiProperty({ enum: ISOLocaleCode })
  isoLocaleCode: ISOLocaleCode;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  syncedAt: Date;

  @Expose()
  @ApiProperty({ type: () => GroupDataOfflineBaseOutput })
  @Type(() => GroupDataOfflineBaseOutput)
  group: GroupDataOfflineBaseOutput;

  @Expose()
  @ApiProperty({ type: () => [MachineDataOfflineBaseOutput] })
  @Type(() => MachineDataOfflineBaseOutput)
  machines: MachineDataOfflineBaseOutput[];

  @Expose()
  @ApiProperty({ type: () => [CustomInspectionFormDataOfflineBaseOutput] })
  @Type(() => CustomInspectionFormDataOfflineBaseOutput)
  customInspectionForms: CustomInspectionFormDataOfflineBaseOutput[];

  @Expose()
  @ApiProperty({ type: () => [CustomInspectionItemDataOfflineBaseOutput] })
  @Type(() => CustomInspectionItemDataOfflineBaseOutput)
  customInspectionItems: CustomInspectionItemDataOfflineBaseOutput[];

  @Expose()
  @ApiProperty({ type: () => [CustomInspectionItemMediaDataOfflineBaseOutput] })
  @Type(() => CustomInspectionItemMediaDataOfflineBaseOutput)
  customInspectionItemMedias: CustomInspectionItemMediaDataOfflineBaseOutput[];
}
