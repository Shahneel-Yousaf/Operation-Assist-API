import {
  BlobServiceClient,
  ContainerClient,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import {
  GenerateUploadUrlInput,
  GenerateVideoUploadUrlInput,
} from '@blob-storage/dtos';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileType } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { Cache } from 'cache-manager';

import * as streamToBufferModule from '../../shared/utils/commons';
import { BlobStorageService } from './blob-storage.service';
import { BlobStorageFileService } from './blob-storage-file.service';

jest.mock('../../shared/utils/commons');
jest.mock('@azure/storage-blob', () => ({
  ContainerSASPermissions: {
    parse: () => jest.fn(),
  },
  generateBlobSASQueryParameters: jest.fn(),
  StorageSharedKeyCredential: jest.fn(),
  BlobServiceClient: jest.fn(),
  ContainerClient: jest.fn(),
  BlobClient: jest.fn(),
  BlockBlobClient: jest.fn(),
}));
const mockUnix = jest.fn();
jest.mock('dayjs', () => () => ({
  toDate: jest.fn().mockReturnThis(),
  add: jest.fn().mockReturnThis(),
  unix: mockUnix,
  default: jest.fn().mockReturnThis(),
}));
const mockCache = {
  get: jest.fn(),
  set: jest.fn(),
} as unknown as Cache;
describe('BlobStorageService', () => {
  let service: BlobStorageService;
  let module: TestingModule;
  const mockConfigService = { get: jest.fn() } as unknown as ConfigService;
  const mockAppLogger = {
    setContext: jest.fn(),
    log: jest.fn,
  } as unknown as AppLogger;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        BlobStorageService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AppLogger, useValue: mockAppLogger },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<BlobStorageService>(BlobStorageService);
  });

  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSasUrl', () => {
    it('generate Sas Url success when blobPath is null', async () => {
      expect(service.generateSasUrl(null)).toEqual(null);
    });

    it('generate Sas Url success when blobPath is not null', async () => {
      const mockBlobPath: string = 'sasUrl/image';

      (generateBlobSASQueryParameters as jest.Mock).mockReturnValue(
        'queryParameters',
      );
      jest
        .spyOn(mockConfigService, 'get')
        .mockReturnValueOnce('storageAccount')
        .mockReturnValueOnce('storageContainer')
        .mockReturnValueOnce('storageConnectionKey');

      const mockService = new BlobStorageService(
        mockConfigService,
        mockAppLogger,
      );

      expect(mockService.generateSasUrl(mockBlobPath)).toEqual(
        'https://storageAccount.blob.core.windows.net/storageContainer/sasUrl/image?queryParameters',
      );
    });

    it('should throw error when generateBlobSASQueryParameters fail', async () => {
      const mockBlobPath: string = 'sasUrl/image';

      (generateBlobSASQueryParameters as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        service.generateSasUrl(mockBlobPath);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('generateSasQueryForContainer', () => {
    it('generate Sas Url for container success', async () => {
      (generateBlobSASQueryParameters as jest.Mock).mockReturnValue(
        'queryParameters',
      );

      expect(service.generateSasQueryForContainer()).toEqual('queryParameters');
    });

    it('should throw error when generateBlobSASQueryParameters fail', async () => {
      (generateBlobSASQueryParameters as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        service.generateSasQueryForContainer();
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('generateUploadUrl', () => {
    const mockRequest: GenerateUploadUrlInput = {
      type: UploadFileType.USER,
      fileName: 'test.png',
    };

    it('generate upload Url success', async () => {
      (generateBlobSASQueryParameters as jest.Mock).mockReturnValue(
        'queryParameters',
      );
      mockUnix.mockReturnValue(123456);
      jest
        .spyOn(mockConfigService, 'get')
        .mockReturnValueOnce('storageAccount')
        .mockReturnValueOnce('storageContainer')
        .mockReturnValueOnce('storageConnectionKey');

      const mockService = new BlobStorageService(
        mockConfigService,
        mockAppLogger,
      );

      expect(mockService.generateUploadUrl(ctx, mockRequest)).toEqual({
        filePath: 'users/123456-test.png',
        sasUrl:
          'https://storageAccount.blob.core.windows.net/storageContainer/users/123456-test.png?queryParameters',
      });
    });

    it('should throw error when generateBlobSASQueryParameters fail', async () => {
      (generateBlobSASQueryParameters as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        service.generateUploadUrl(ctx, mockRequest);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('getFileContent', () => {
    const mockService = new BlobStorageFileService(
      mockConfigService,
      mockAppLogger,
      mockCache,
    );

    const blobName = 'fakeBlobName';

    it('should retrieve content from cache if available', async () => {
      const cachedContent = '{"key": "value"}';
      jest.spyOn(mockCache, 'get').mockResolvedValueOnce(cachedContent);

      const result = await mockService.getFileContent(blobName, { ttl: 300 });

      expect(result).toEqual(cachedContent);
    });

    it('get File content success', async () => {
      jest.spyOn(mockCache, 'get').mockResolvedValueOnce(null);

      const mockDownload = jest.fn();
      (BlobServiceClient as any).prototype.getContainerClient = jest.fn(() => ({
        getBlobClient: jest.fn(() => ({
          download: mockDownload,
        })),
      }));

      const mockReadableStream = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback(Buffer.from('{"key": "value"}'));
          } else if (event === 'end') {
            callback();
          }
        }),
      } as unknown as NodeJS.ReadableStream;

      const mockDownloadResponse = mockDownload.mockResolvedValueOnce({
        readableStreamBody: mockReadableStream,
      });

      (ContainerClient as jest.Mock).mockImplementation(() => {
        return {
          getBlobClient: jest.fn().mockReturnValue({
            download: jest.fn().mockResolvedValue(mockDownloadResponse),
          }),
        };
      });

      jest.spyOn(mockCache, 'set').mockResolvedValue(undefined);

      (streamToBufferModule.streamToBuffer as jest.Mock).mockResolvedValue(
        Buffer.from('{"key": "value"}'),
      );

      const result = await mockService.getFileContent(blobName);

      expect(result).toEqual('{"key": "value"}');
    });
  });

  describe('generateVideoUploadUrl', () => {
    const mockRequest: GenerateVideoUploadUrlInput = {
      type: UploadFileType.USER,
      fileName: 'test.mov',
    };

    it('generate upload Url success', async () => {
      (generateBlobSASQueryParameters as jest.Mock).mockReturnValue(
        'queryParameters',
      );
      mockUnix.mockReturnValue(123456);
      jest
        .spyOn(mockConfigService, 'get')
        .mockReturnValueOnce('storageAccount')
        .mockReturnValueOnce('storageContainer')
        .mockReturnValueOnce('storageConnectionKey')
        .mockReturnValueOnce('thumbnails');

      const mockService = new BlobStorageService(
        mockConfigService,
        mockAppLogger,
      );

      expect(mockService.generateVideoUploadUrl(ctx, mockRequest)).toEqual({
        filePath: 'users/123456-test.mov',
        sasUrl:
          'https://storageAccount.blob.core.windows.net/storageContainer/users/123456-test.mov?queryParameters',
        thumbnailSasUrl:
          'https://storageAccount.blob.core.windows.net/storageContainer/thumbnails/123456-test.jpeg?queryParameters',
      });
    });

    it('should throw error when generateBlobSASQueryParameters fail', async () => {
      (generateBlobSASQueryParameters as jest.Mock).mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        service.generateVideoUploadUrl(ctx, mockRequest);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
