import { SetMetadata } from '@nestjs/common';
import { MIDDLEWARE_EXCEPTION, MiddlewareEnum } from '@shared/constants';

export const MiddlewareException = (guards: MiddlewareEnum[]) =>
  SetMetadata(MIDDLEWARE_EXCEPTION, guards);
