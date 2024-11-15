import { ISOLocaleCode, UserCurrentStatus } from '@shared/constants';
import { Expose } from 'class-transformer';

export class UserAccessTokenClaims {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  isoLocaleCode: ISOLocaleCode;

  @Expose()
  surname: string;

  @Expose()
  givenName: string;

  @Expose()
  searchId: string;

  @Expose()
  pictureUrl: string;

  @Expose()
  isSearchableByEmail: boolean;

  @Expose()
  registeredAt: Date;

  @Expose()
  residenceCountryCode: string;

  @Expose()
  dateOfBirth: string;

  @Expose()
  currentStatus: UserCurrentStatus;

  @Expose()
  lastStatusUpdatedAt: Date;
}
