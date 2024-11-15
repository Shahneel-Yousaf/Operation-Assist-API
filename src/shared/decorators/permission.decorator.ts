import { SetMetadata } from '@nestjs/common';
import { PERMISSION_METADATA } from '@shared/constants';

export const Permission = (permission: string) =>
  SetMetadata(PERMISSION_METADATA, permission);
