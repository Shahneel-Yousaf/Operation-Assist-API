import { Expose } from 'class-transformer';

export class UserFcmTokenPushNotification {
  @Expose()
  fcmToken: string;

  @Expose()
  userId: string;
}
