import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';

import { BlobStorageController } from './controllers/blob-storage.controller';
import { BlobStorageService } from './services/blob-storage.service';
import { BlobStorageFileService } from './services/blob-storage-file.service';

@Module({
  imports: [SharedModule],
  controllers: [BlobStorageController],
  providers: [BlobStorageService, BlobStorageFileService],
  exports: [BlobStorageService, BlobStorageFileService],
})
export class BlobStorageModule {}
