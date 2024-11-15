import { ISOLocaleCode } from '@shared/constants';
import { CiamLinkType } from '@shared/dtos/user-ciam-link-output.dto';

import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';

export class RequestContext {
  public requestID: string;

  public url: string;

  public ip: string;

  public method: string;

  // TODO : Discuss with team if this import is acceptable or if we should move UserAccessTokenClaims to shared.
  public user: UserAccessTokenClaims;

  public userCiamLink: CiamLinkType;

  public isoLocaleCode: ISOLocaleCode;
}
