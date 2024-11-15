import { Group } from '@group/entities';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GroupContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Group => {
    const request = ctx.switchToHttp().getRequest();
    return request.group;
  },
);
