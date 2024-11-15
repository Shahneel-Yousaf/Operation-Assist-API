import { AuthenticationResult } from '@azure/msal-node';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import axios from 'axios';

import { GraphAPIService } from './graph-api.service';

const mockAcquireTokenByClientCredential = jest.fn();
jest.mock('@azure/msal-node', () => ({
  ConfidentialClientApplication: jest.fn(() => ({
    acquireTokenByClientCredential: mockAcquireTokenByClientCredential,
  })),
}));
const ctx = new RequestContext();
describe('GraphAPIService', () => {
  let service: GraphAPIService;
  let module: TestingModule;
  const mockConfigService = { get: jest.fn() } as unknown as ConfigService;
  const mockAppLogger = {
    setContext: jest.fn(),
    log: jest.fn,
  } as unknown as AppLogger;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        GraphAPIService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AppLogger, useValue: mockAppLogger },
      ],
    }).compile();

    service = module.get<GraphAPIService>(GraphAPIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteB2CUser', () => {
    it('deleteB2CUser success', async () => {
      const oid = 'id';
      const mockGetAccessToken: AuthenticationResult = {
        authority: 'string',
        uniqueId: 'String',
        tenantId: 'String',
        scopes: ['string'],
        account: null,
        idToken: 'String',
        idTokenClaims: {},
        accessToken: 'String',
        fromCache: true,
        expiresOn: null,
        tokenType: 'String',
        correlationId: 'String',
      };
      mockAcquireTokenByClientCredential.mockReturnValue(mockGetAccessToken);
      jest
        .spyOn(axios, 'delete')
        .mockImplementation(() => Promise.resolve({ status: 200, data: {} }));
      await expect(service.deleteB2CUser(ctx, oid)).resolves.not.toThrow();
    });

    it('deleteB2CUser not success', async () => {
      const oid = 'id';
      const mockGetAccessToken: AuthenticationResult = {
        authority: 'string',
        uniqueId: 'String',
        tenantId: 'String',
        scopes: ['string'],
        account: null,
        idToken: 'String',
        idTokenClaims: {},
        accessToken: 'String',
        fromCache: true,
        expiresOn: null,
        tokenType: 'String',
        correlationId: 'String',
      };
      mockAcquireTokenByClientCredential.mockReturnValue(mockGetAccessToken);
      jest.spyOn(axios, 'delete').mockImplementation(() => {
        throw new HttpException(
          {
            message: 'delete user b2c error',
            errorType: 'NOT_FOUND',
          },
          404,
        );
      });
      try {
        await service.deleteB2CUser(ctx, oid);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('delete user b2c error');
      }
    });
  });
});
