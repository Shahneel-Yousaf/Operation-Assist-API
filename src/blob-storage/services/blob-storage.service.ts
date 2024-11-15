import {
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import {
  GenerateUploadUrlInput,
  GenerateUploadUrlOutput,
  GenerateVideoUploadUrlInput,
  GenerateVideoUploadUrlOutput,
} from '@blob-storage/dtos';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FILE_NAME_REGEX,
  READ_FILE_EXPIRE_TIME,
  REPLACE_CHAR,
  SasPermissionValue,
  THUMBNAIL_EXTENSION,
  THUMBNAIL_REGEX,
  THUMBNAILS,
  WRITE_FILE_EXPIRE_TIME,
} from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class BlobStorageService {
  private sharedKeyCredential: StorageSharedKeyCredential;
  private storageAccount: string;
  private storageAccountUrl: string;
  private storageContainer: string;
  private storageConnectionKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.storageAccount = this.configService.get<string>(
      'azure.storeAccount.storageAccount',
    );
    this.storageContainer = this.configService.get<string>(
      'azure.storeAccount.storageContainer',
    );
    this.storageConnectionKey = this.configService.get<string>(
      'azure.storeAccount.storageConnectionKey',
    );
    this.storageAccountUrl = `https://${this.storageAccount}.blob.core.windows.net`;
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.storageAccount,
      this.storageConnectionKey,
    );
  }

  generateSasUrl(
    blobPath: string,
    permissions: SasPermissionValue = SasPermissionValue.READ,
    expireTime = READ_FILE_EXPIRE_TIME,
  ): string {
    if (!blobPath) return null;

    const blobSASSignatureValues = {
      blobName: blobPath,
      containerName: this.storageContainer,
      permissions: ContainerSASPermissions.parse(permissions),
      startsOn: dayjs().toDate(),
      expiresOn: dayjs().add(expireTime, 'ms').toDate(),
    };

    const queryParameters = generateBlobSASQueryParameters(
      blobSASSignatureValues,
      this.sharedKeyCredential,
    ).toString();

    return `${this.storageAccountUrl}/${this.storageContainer}/${blobPath}?${queryParameters}`;
  }

  generateSasQueryForContainer(
    permissions: SasPermissionValue = SasPermissionValue.READ,
    expireTime = READ_FILE_EXPIRE_TIME,
  ): string {
    const blobSASSignatureValues = {
      containerName: this.storageContainer,
      permissions: ContainerSASPermissions.parse(permissions),
      startsOn: dayjs().toDate(),
      expiresOn: dayjs().add(expireTime, 'ms').toDate(),
    };

    return generateBlobSASQueryParameters(
      blobSASSignatureValues,
      this.sharedKeyCredential,
    ).toString();
  }

  generateUploadUrl(
    ctx: RequestContext,
    generateUploadUrlInput: GenerateUploadUrlInput,
  ): GenerateUploadUrlOutput {
    this.logger.log(ctx, `${this.generateUploadUrl.name} was called`);

    const { type, fileName } = generateUploadUrlInput;

    // Generate random filename
    const filePath = `${type}/${dayjs().unix()}-${fileName.replace(
      FILE_NAME_REGEX,
      REPLACE_CHAR,
    )}`;

    return {
      sasUrl: this.generateSasUrl(
        filePath,
        SasPermissionValue.WRITE,
        WRITE_FILE_EXPIRE_TIME,
      ),
      filePath: filePath,
    };
  }

  generateVideoUploadUrl(
    ctx: RequestContext,
    generateVideoUploadUrlInput: GenerateVideoUploadUrlInput,
  ): GenerateVideoUploadUrlOutput {
    this.logger.log(ctx, `${this.generateVideoUploadUrl.name} was called`);

    const { type, fileName } = generateVideoUploadUrlInput;

    const timestampUnix = dayjs().unix();

    // Generate random filename
    const filePath = `${type}/${timestampUnix}-${fileName.replace(
      FILE_NAME_REGEX,
      REPLACE_CHAR,
    )}`;

    // GenerateThumbnailPath
    const fileThumbnailPath = this.generateThumbnailPath(filePath);

    return {
      sasUrl: this.generateSasUrl(
        filePath,
        SasPermissionValue.WRITE,
        WRITE_FILE_EXPIRE_TIME,
      ),
      filePath: filePath,
      thumbnailSasUrl: this.generateSasUrl(
        fileThumbnailPath,
        SasPermissionValue.WRITE,
        WRITE_FILE_EXPIRE_TIME,
      ),
    };
  }

  generateThumbnailPath(filePath: string) {
    return (
      filePath.replace(THUMBNAIL_REGEX, `${THUMBNAILS}$2`) + THUMBNAIL_EXTENSION
    );
  }
}
