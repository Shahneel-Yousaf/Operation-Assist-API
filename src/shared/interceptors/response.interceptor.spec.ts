import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MiddlewareEnum } from '@shared/constants';

import { AppLogger } from '../logger/logger.service';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let responseInterceptor: ResponseInterceptor;

  const mockRequest = {
    headers: {},
    url: 'mock-url',
    header: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
    getHandler: jest.fn(() => {}),
  } as unknown as ExecutionContext;

  const mockCallHandler = {
    handle: jest.fn(),
    pipe: jest.fn().mockReturnThis(),
  };

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    responseInterceptor = new ResponseInterceptor(
      new AppLogger(new ConfigService()),
      mockReflector as any,
    );
  });

  it('should be defined', () => {
    expect(responseInterceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('intercept', async () => {
      (
        mockExecutionContext.switchToHttp().getRequest as jest.Mock<any, any>
      ).mockReturnValueOnce(mockRequest);
      mockCallHandler.handle.mockReturnValueOnce({
        pipe: jest.fn(),
      });

      mockReflector.get.mockReturnValue(MiddlewareEnum.RESPONSE_INTERCEPTOR);
      responseInterceptor.intercept(mockExecutionContext, mockCallHandler);
    });
  });
});
