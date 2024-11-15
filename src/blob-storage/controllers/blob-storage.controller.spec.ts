import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileType } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';

import {
  GenerateUploadUrlInput,
  GenerateUploadUrlOutput,
  GenerateVideoUploadUrlInput,
  GenerateVideoUploadUrlOutput,
} from '../dtos';
import { BlobStorageService } from '../services/blob-storage.service';
import { BlobStorageController } from './blob-storage.controller';

jest.mock(
  '@azure/storage-blob',
  jest.fn().mockImplementation(() => ({
    ContainerSASPermissions: jest.fn(),
    generateBlobSASQueryParameters: jest.fn(),
    StorageSharedKeyCredential: jest.fn(),
  })),
);
describe('BlobStorageController', () => {
  let controller: BlobStorageController;
  const mockService = {
    generateUploadUrl: jest.fn(),
    generateVideoUploadUrl: jest.fn(),
  } as unknown as BlobStorageService;

  beforeEach(async () => {
    const mockConfigService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlobStorageController,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: BlobStorageService, useValue: mockService },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<BlobStorageController>(BlobStorageController);
  });

  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Generate upload url', () => {
    const mockInput: GenerateUploadUrlInput = {
      type: UploadFileType.USER,
      fileName: 'test.png',
    };

    it('should return success', () => {
      const returnValues: GenerateUploadUrlOutput = {
        sasUrl: 'sasUrl',
        filePath: 'filePath',
      };

      jest
        .spyOn(mockService, 'generateUploadUrl')
        .mockReturnValue(returnValues);

      const groups = controller.generateUploadUrl(ctx, mockInput);
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockService.generateUploadUrl).toHaveBeenCalledWith(
        ctx,
        mockInput,
      );
    });

    it('should throw error when groupService fail', async () => {
      jest.spyOn(mockService, 'generateUploadUrl').mockImplementation(() => {
        throw new Error('Test error');
      });

      try {
        controller.generateUploadUrl(ctx, mockInput);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }

      expect(mockService.generateUploadUrl).toHaveBeenCalledWith(
        ctx,
        mockInput,
      );
    });
  });

  describe('Generate upload url for video', () => {
    const mockInput: GenerateVideoUploadUrlInput = {
      type: UploadFileType.USER,
      fileName: 'test.mov',
    };

    it('should return success', () => {
      const returnValues: GenerateVideoUploadUrlOutput = {
        sasUrl: 'sasUrl',
        filePath: 'filePath',
        thumbnailSasUrl: 'thumbnailSasUrl',
      };

      jest
        .spyOn(mockService, 'generateVideoUploadUrl')
        .mockReturnValue(returnValues);

      const groups = controller.generateVideoUploadUrl(ctx, mockInput);
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockService.generateVideoUploadUrl).toHaveBeenCalledWith(
        ctx,
        mockInput,
      );
    });

    it('should throw error when groupService fail', async () => {
      jest
        .spyOn(mockService, 'generateVideoUploadUrl')
        .mockImplementation(() => {
          throw new Error('Test error');
        });

      try {
        controller.generateVideoUploadUrl(ctx, mockInput);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }

      expect(mockService.generateVideoUploadUrl).toHaveBeenCalledWith(
        ctx,
        mockInput,
      );
    });
  });
});
