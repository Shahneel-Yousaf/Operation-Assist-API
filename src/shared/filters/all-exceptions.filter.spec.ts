import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { apiSyncPaths, StatusName } from '@shared/constants';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';

import { AppLogger } from '../logger/logger.service';
import { AllExceptionsFilter } from './all-exceptions.filter';

const mockMessage1 = 'mock exception string';
const mockMessage2 = { hello: 'world', hi: 'joe' };
const mockMessage3 = 'Something is very wrong';

const mockException1 = new HttpException(mockMessage1, HttpStatus.NOT_FOUND);
const mockException2 = new HttpException(mockMessage2, HttpStatus.BAD_REQUEST);
const mockException3 = new HttpException(mockMessage2, HttpStatus.FORBIDDEN);

const mockError = new Error(mockMessage3);

describe('AllExceptionsFilter', () => {
  let mockContext: any;
  let mockRequest: any;
  let mockResponse: any;
  let requestId: string;
  let mockRequest2: any;
  let mockContext2: any;

  const mockConfigService = {
    get: () => 'development',
  };
  const mockedLogger = {
    warn: jest.fn().mockReturnThis(),
    error: jest.fn().mockReturnThis(),
    log: jest.fn().mockReturnThis(),
    setContext: jest.fn().mockReturnThis(),
  };
  const mockI18n = { t: jest.fn() };
  let filter: AllExceptionsFilter<any>;

  beforeEach(async () => {
    /** mock request object */
    requestId = uuidv4();
    mockRequest = {
      headers: {},
      url: 'mock-url',
      header: () => requestId,
    };
    mockRequest2 = {
      headers: {},
      url: apiSyncPaths[0],
      header: () => requestId,
    };

    /** mock response object */
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    /** mock execution context */
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    };

    mockContext2 = {
      switchToHttp: () => ({
        getRequest: () => mockRequest2,
        getResponse: () => mockResponse,
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AppLogger, useValue: mockedLogger },
        { provide: I18nService, useValue: mockI18n },
      ],
    }).compile();

    // config = moduleRef.get<ConfigService>(ConfigService);
    filter = moduleRef.get<AllExceptionsFilter<any>>(AllExceptionsFilter);
  });

  it('should be defined', async () => {
    expect(filter).toBeDefined();
  });

  it('should handle both HttpException and unhandled Error', async () => {
    filter.catch(mockException1, mockContext);
    expect(mockResponse.status).toBeCalled();
    expect(mockResponse.json).toBeCalled();

    filter.catch(mockError, mockContext);
    expect(mockResponse.status).toBeCalled();
    expect(mockResponse.json).toBeCalled();
  });

  it('should handle HttpException with right status code', async () => {
    filter.catch(mockException1, mockContext);
    expect(mockResponse.status).toBeCalledWith(HttpStatus.NOT_FOUND);

    filter.catch(mockException2, mockContext);
    expect(mockResponse.status).toBeCalledWith(HttpStatus.BAD_REQUEST);
  });

  it('should handle unhandled error with status code 500', async () => {
    filter.catch(mockError, mockContext);
    expect(mockResponse.status).toBeCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('should handle exception with plain string message', async () => {
    filter.catch(mockException1, mockContext);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          message: mockMessage1,
        }),
      }),
    );
  });

  it('should handle exception with object type message', async () => {
    filter.catch(mockException2, mockContext);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          details: mockMessage2,
        }),
      }),
    );
  });

  it('should respond with Error message in development mode', async () => {
    // const configSpy = jest
    //   .spyOn(config, 'get')
    //   .mockImplementation(() => 'development');

    filter.catch(mockError, mockContext);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: mockMessage3,
        }),
      }),
    );

    // configSpy.mockClear();
  });

  it('should suppress Error message in production mode', async () => {
    const configSpy = jest
      .spyOn(mockConfigService, 'get')
      .mockImplementation(() => 'production');

    filter.catch(mockError, mockContext);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        }),
      }),
    );

    configSpy.mockClear();
  });

  it('should contain request id in response', async () => {
    filter.catch(mockMessage1, mockContext);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          requestId: requestId,
        }),
      }),
    );
  });

  it('should contain request path in response', async () => {
    filter.catch(mockMessage1, mockContext);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          path: mockRequest.url,
        }),
      }),
    );
  });

  it('should contain timestamp in response', async () => {
    const mockDate = new Date();

    const dateSpy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate);

    filter.catch(mockException1, mockContext);
    expect(mockResponse.status).toBeCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          timestamp: mockDate.toISOString(),
        }),
      }),
    );
    dateSpy.mockClear();
  });

  it('should return syncStatus INVALID_DATA', async () => {
    filter.catch(mockException2, mockContext2);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          syncStatus: StatusName.INVALID_DATA,
        }),
      }),
    );
  });

  it('should return syncStatus INVALID_DATA', async () => {
    filter.catch(mockException3, mockContext2);
    expect(mockResponse.json).toBeCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          statusCode: HttpStatus.FORBIDDEN,
          syncStatus: StatusName.PERMISSION_ERROR,
        }),
      }),
    );
  });
});
