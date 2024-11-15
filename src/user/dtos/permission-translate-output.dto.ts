import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, ISOLocaleCode } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class PermissionTranslateOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  permissionId: string;

  @Expose()
  @ApiProperty(defaultExamples.localeCode)
  @IsEnum(ISOLocaleCode)
  isoLocaleCode: ISOLocaleCode;

  @Expose()
  @ApiProperty()
  permissionName: string;

  @Expose()
  @ApiProperty()
  isChecked: boolean;
}
