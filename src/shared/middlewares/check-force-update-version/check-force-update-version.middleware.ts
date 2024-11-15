import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeviceOS,
  OS,
  PLATFORM,
  Platform,
  STATUS_CODE_UPGRADE_REQUIRED,
  VERSION,
} from '@shared/constants';
import { NextFunction, Request, Response } from 'express';
import * as semver from 'semver';

@Injectable()
export class CheckForceUpdateVersionMiddleware {
  private forceVersion: object;

  constructor(private readonly configService: ConfigService) {
    this.forceVersion = {
      [DeviceOS.IOS]: this.configService.get<string>('versionApp.ios'),
      [DeviceOS.ANDROID]: this.configService.get<string>('versionApp.android'),
    };
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers[PLATFORM] === Platform.WEBAPP) {
      return next();
    }

    const os = req.headers[OS] as string;
    if (!(os in DeviceOS)) {
      throw new BadRequestException('OS is not valid.');
    }

    const version = req.headers[VERSION] as string;
    if (!version) {
      throw new BadRequestException('Version is not exist in header.');
    }

    if (!semver.valid(version)) {
      throw new BadRequestException('Version format is incorrect.');
    }

    if (semver.lt(version, this.forceVersion[os])) {
      throw new HttpException(
        'Force update required.',
        STATUS_CODE_UPGRADE_REQUIRED,
      );
    }

    next();
  }
}
