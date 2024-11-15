import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  DeviceCurrentStatus,
  DevicePlatform,
} from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UpdateUserDeviceOutput {
  @Expose()
  @ApiProperty({
    description: defaultExamples.updateUserDeviceOutput.deviceId.description,
    ...defaultExamples.entityId,
  })
  deviceId: string;

  @Expose()
  @ApiProperty(defaultExamples.updateUserDeviceOutput.userId)
  userId: string;

  @Expose()
  @ApiProperty(defaultExamples.updateUserDeviceOutput.deviceType)
  @IsEnum(DevicePlatform)
  deviceType: DevicePlatform;

  @Expose()
  @ApiProperty(defaultExamples.updateUserDeviceOutput.fcmToken)
  fcmToken: string;

  @Expose()
  @ApiProperty({
    description:
      defaultExamples.updateUserDeviceOutput.lastActiveAt.description,
    ...defaultExamples.dateTime,
  })
  lastActiveAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.updateUserDeviceOutput.currentStatus)
  @IsEnum(DeviceCurrentStatus)
  currentStatus: DeviceCurrentStatus;

  @Expose()
  @ApiProperty({
    description:
      defaultExamples.updateUserDeviceOutput.lastStatusUpdatedAt.description,
    ...defaultExamples.dateTime,
  })
  lastStatusUpdatedAt: Date;
}
