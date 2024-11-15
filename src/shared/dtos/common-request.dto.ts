import { CiamLinkType } from '.';

export class CommonRequest {
  claim: CiamLinkType;

  headers: Record<string, string>;
}
