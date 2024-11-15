import { ApiProperty } from '@nestjs/swagger';
import {
  defaultExamples,
  ISOLocaleCode,
  UserCurrentStatus,
} from '@shared/constants';
import { TrimString } from '@shared/decorators';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UserOutput {
  @Expose()
  @ApiProperty(defaultExamples.entityId)
  userId: string;

  @Expose()
  @ApiProperty()
  searchId: string;

  @Expose()
  @ApiProperty()
  givenName: string;

  @Expose()
  @ApiProperty()
  surname: string;

  @Expose()
  @ApiProperty({ nullable: true })
  pictureUrl: string;

  @Expose()
  @ApiProperty(defaultExamples.userEmail)
  email: string;

  @Expose()
  @ApiProperty()
  isSearchableByEmail: boolean;

  @Expose()
  @ApiProperty(defaultExamples.dateTime)
  registeredAt: Date;

  @Expose()
  @ApiProperty(defaultExamples.localeCode)
  @IsEnum(ISOLocaleCode)
  isoLocaleCode: ISOLocaleCode;

  @Expose()
  @ApiProperty()
  @TrimString()
  residenceCountryCode: string;

  @Expose()
  @ApiProperty(defaultExamples.yearOnly)
  dateOfBirth: string;

  @Expose()
  @ApiProperty({ ...defaultExamples.userCurrentStatus, nullable: true })
  @IsEnum(UserCurrentStatus)
  currentStatus: UserCurrentStatus;

  @Expose()
  @ApiProperty({ ...defaultExamples.dateTime, nullable: true })
  lastStatusUpdatedAt: Date;

  @Expose()
  @ApiProperty()
  suppressDataUsagePopup: boolean;
}
