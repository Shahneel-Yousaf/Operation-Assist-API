import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { middlewaresExclude } from '@shared/utils/commons';

import { AuthGuard } from './auth.guard';

const mockGetSigningKey = jest.fn();
jest.mock('../utils/commons');
jest.mock('jwks-rsa', () =>
  jest.fn().mockImplementation(() => ({
    getSigningKey: mockGetSigningKey,
  })),
);
describe('Auth guard', () => {
  let authGuard;
  const mockReflector = {} as Reflector;
  const mockJwtService = {
    decode: jest.fn(),
    verify: jest.fn(),
  } as unknown as JwtService;
  const mockConfigService = {
    get: jest.fn(),
  } as unknown as ConfigService;

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
  };

  it('should return true when middleware exception excluded', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(true);

    authGuard = new AuthGuard(mockReflector, mockJwtService, mockConfigService);

    const result = await authGuard.canActivate(mockExecutionContext);

    expect(result).toEqual(true);
  });

  it('show return true when idToken valid', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    mockJwtService.decode = jest.fn().mockReturnValue({
      header: { kid: 'mock kid' },
    });

    mockJwtService.verify = jest
      .fn()
      .mockReturnValue({ oid: 'oid', iss: 'iss', emails: ['email'] });

    mockExecutionContext.getRequest = jest.fn().mockReturnValue({
      headers: { 'x-access-token': 'Bearer token', 'x-lang': 'en' },
    });

    mockGetSigningKey.mockReturnValue({ getPublicKey: () => {} });

    authGuard = new AuthGuard(mockReflector, mockJwtService, mockConfigService);

    const result = await authGuard.canActivate(mockExecutionContext);

    expect(result).toEqual(true);
  });

  it('show error x-lang', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    mockJwtService.decode = jest.fn().mockReturnValue({
      header: { kid: 'mock kid' },
    });

    mockJwtService.verify = jest
      .fn()
      .mockReturnValue({ oid: 'oid', iss: 'iss', emails: ['email'] });

    mockExecutionContext.getRequest = jest.fn().mockReturnValue({
      headers: { 'x-access-token': 'Bearer token', 'x-lang': 'test' },
    });

    mockGetSigningKey.mockReturnValue({ getPublicKey: () => {} });

    authGuard = new AuthGuard(mockReflector, mockJwtService, mockConfigService);

    try {
      await authGuard.canActivate(mockExecutionContext);
    } catch (expectError) {
      expect(expectError).toBeInstanceOf(HttpException);
      expect(expectError.message).toEqual(
        'x-lang must be one of the following values: en, es, ja, pt, ar, ur',
      );
    }
  });

  it('show return UnauthorizedException when idToken not verify', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    mockJwtService.decode = jest.fn().mockReturnValue({
      header: { kid: 'mock kid' },
    });

    mockExecutionContext.getRequest = jest
      .fn()
      .mockReturnValue({ headers: { authorization: 'Bearer token' } });

    mockGetSigningKey.mockReturnValue({ getPublicKey: () => {} });

    authGuard = new AuthGuard(mockReflector, mockJwtService, mockConfigService);

    mockJwtService.verify = jest.fn().mockImplementation(() => {
      throw new Error('Not verify');
    });

    try {
      await authGuard.canActivate(mockExecutionContext);
    } catch (expectError) {
      expect(expectError).toBeInstanceOf(HttpException);
    }
  });
});
