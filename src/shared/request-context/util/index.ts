import {
  FORWARDED_FOR_TOKEN_HEADER,
  REQUEST_ID_TOKEN_HEADER,
} from '../../constants';
import { RequestContext } from '../request-context.dto';

// Creates a RequestContext object from Request
export function createRequestContext(
  request: Record<string, any>,
): RequestContext {
  const ctx = new RequestContext();
  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER);
  ctx.url = request.url;
  ctx.method = request.method;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER)
    ? request.header(FORWARDED_FOR_TOKEN_HEADER)
    : request.ip;

  ctx.user = request?.user;
  ctx.userCiamLink = request?.claim;
  ctx.isoLocaleCode = request?.isoLocaleCode;

  return ctx;
}
