import { Expose } from 'class-transformer';

export class CiamLinkType {
  @Expose()
  oid: string;

  @Expose()
  iss: string;

  @Expose({ name: 'preferred_username' })
  preferredUsername: string;

  @Expose()
  emails: string[];
}
