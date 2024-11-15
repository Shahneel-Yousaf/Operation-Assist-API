import { ExecutionContext } from '@nestjs/common';

export const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.claim = {
      preferredUsername: 'default-admin@example.com',
      oid: 'example_oid',
      iss: 'https://exampleiss.com/oid',
      emails: ['email'],
    };
    return true;
  },
};
