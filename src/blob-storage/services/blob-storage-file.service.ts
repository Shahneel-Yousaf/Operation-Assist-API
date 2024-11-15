import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '@shared/logger/logger.service';
import { streamToBuffer } from '@shared/utils/commons';
import { Cache } from 'cache-manager';

@Injectable()
export class BlobStorageFileService {
  private sharedKeyCredential: StorageSharedKeyCredential;
  private storageAccount: string;
  private storageAccountUrl: string;
  private storageContainer: string;
  private storageConnectionKey: string;
  private blobServiceClient: BlobServiceClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.storageAccount = this.configService.get<string>(
      'azure.storeAccountFile.fileStoreAccount',
    );
    this.storageContainer = this.configService.get<string>(
      'azure.storeAccountFile.fileStorageContainer',
    );
    this.storageConnectionKey = this.configService.get<string>(
      'azure.storeAccountFile.fileStorageConnectionKey',
    );
    this.storageAccountUrl = `https://${this.storageAccount}.blob.core.windows.net`;
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.storageAccount,
      this.storageConnectionKey,
    );
    this.blobServiceClient = new BlobServiceClient(
      this.storageAccountUrl,
      this.sharedKeyCredential,
    );
  }

  async getFileContent(
    blobName: string,
    useCache = { ttl: 300000 },
  ): Promise<string> {
    if (useCache) {
      const fileContent = await this.cacheManager.get<string>(blobName);
      if (fileContent) {
        return fileContent;
      }
    }

    const containerClient = this.blobServiceClient.getContainerClient(
      this.storageContainer,
    );
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadResponse = await blobClient.download();
    const downloaded = await streamToBuffer(
      downloadResponse.readableStreamBody,
    );

    const content = downloaded.toString();
    if (useCache) {
      await this.cacheManager.set(blobName, content, useCache.ttl);
    }

    return content;
  }
}
