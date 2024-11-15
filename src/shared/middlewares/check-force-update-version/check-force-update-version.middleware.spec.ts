import { BadRequestException, HttpException } from '@nestjs/common';
import { DeviceOS, OS, VERSION } from '@shared/constants';

import { CheckForceUpdateVersionMiddleware } from './check-force-update-version.middleware';

describe('ForceUpdateVersionGuard', () => {
  let middleware: CheckForceUpdateVersionMiddleware;

  const mockConfigService = { get: jest.fn() };
  mockConfigService.get.mockReturnValue('2.0.0');

  beforeEach(() => {
    middleware = new CheckForceUpdateVersionMiddleware(
      mockConfigService as any,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should throw BadRequestException if OS is not valid', () => {
    const mockRequest: any = {
      headers: {
        [OS]: 'InvalidOS',
      },
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    expect(() =>
      middleware.use(mockRequest, mockResponse, mockNext),
    ).toThrowError(BadRequestException);
  });

  it('should throw BadRequestException if version is not provided in headers', () => {
    const mockRequest: any = {
      headers: {},
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    expect(() =>
      middleware.use(mockRequest, mockResponse, mockNext),
    ).toThrowError(BadRequestException);
  });

  it('should throw BadRequestException if version format is incorrect', () => {
    const mockRequest: any = {
      headers: {
        [OS]: DeviceOS.IOS,
        [VERSION]: 'invalidVersion',
      },
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    expect(() =>
      middleware.use(mockRequest, mockResponse, mockNext),
    ).toThrowError(BadRequestException);
  });

  it('should throw HttpException if version is lower than force update version', () => {
    const mockRequest: any = {
      headers: {
        [OS]: DeviceOS.IOS,
        [VERSION]: '1.0.0',
      },
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    mockConfigService.get.mockReturnValue('2.0.0');

    expect(() =>
      middleware.use(mockRequest, mockResponse, mockNext),
    ).toThrowError(HttpException);
  });

  it('should call next() if version is greater than or equal to force update version', () => {
    const mockRequest: any = {
      headers: {
        [OS]: DeviceOS.IOS,
        [VERSION]: '2.0.0',
      },
    };
    const mockResponse: any = {};
    const mockNext = jest.fn();

    mockConfigService.get.mockReturnValue('1.0.0');

    middleware.use(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
