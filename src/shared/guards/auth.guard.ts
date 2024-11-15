import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  ISOLocaleCode,
  LANGUAGE_HEADER,
  MiddlewareEnum,
  X_ACCESS_TOKEN,
} from '@shared/constants';
import { CiamLinkType } from '@shared/dtos';
import { middlewaresExclude } from '@shared/utils/commons';
import { plainToInstance } from 'class-transformer';
import { isEnum } from 'class-validator';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  private client: jwksClient.JwksClient;
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.client = jwksClient({
      cache: true,
      jwksUri: this.configService.get<string>('auth.jwksUri'),
    });
  }

  async canActivate(context: ExecutionContext) {
    // Exclusion guard check
    const authGuard = middlewaresExclude(
      this.reflector,
      context,
      MiddlewareEnum.AUTH_GUARD,
    );

    if (authGuard) return true;

    const req = context.switchToHttp().getRequest();

    const authorization = req.headers[X_ACCESS_TOKEN];

    // Miss token
    if (!authorization) {
      throw new UnauthorizedException('Token not found.');
    }

    // Wrong format
    if (!authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format.');
    }

    const token = authorization.replace('Bearer ', '');

    const decode = this.jwtService.decode(token, { complete: true }) as {
      [key: string]: any;
    };

    const kid = decode?.header?.kid;

    // Wrong header
    if (!kid) {
      throw new UnauthorizedException('Invalid token format header.');
    }

    try {
      // Get public key
      const signingKey = await this.client.getSigningKey(kid);
      const publicKey = signingKey.getPublicKey();

      // Verify token
      const claim = this.jwtService.verify(token, {
        publicKey,
        audience: this.configService.get<string>('auth.audience'),
        issuer: this.configService.get<string>('auth.issuer'),
      });
      req.claim = plainToInstance(CiamLinkType, claim, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNAUTHORIZED, {
        cause: error,
      });
    }
    if (
      req.headers[LANGUAGE_HEADER] &&
      !isEnum(req.headers[LANGUAGE_HEADER], ISOLocaleCode)
    ) {
      throw new BadRequestException({
        message:
          'x-lang must be one of the following values: en, es, ja, pt, ar, ur',
      });
    }

    return true;
  }
}
