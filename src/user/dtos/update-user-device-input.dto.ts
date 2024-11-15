import { ApiProperty } from '@nestjs/swagger';
import { defaultExamples, DevicePlatform } from '@shared/constants';
import { IsEnum, IsString, Length } from 'class-validator';

export class UpdateUserDeviceInput {
  @ApiProperty(defaultExamples.updateUserDeviceInput.deviceType)
  @IsString()
  @IsEnum(DevicePlatform)
  @Length(1, 64)
  deviceType: DevicePlatform;

  @ApiProperty(defaultExamples.updateUserDeviceInput.fcmToken)
  @IsString()
  @Length(1, 255)
  fcmToken: string;
}
