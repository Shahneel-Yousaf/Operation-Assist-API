import { SetMetadata } from '@nestjs/common';
import { PARAM_EXCEPTION, ParamEnum } from '@shared/constants';

export const ParamException = (params: ParamEnum[]) =>
  SetMetadata(PARAM_EXCEPTION, params);
