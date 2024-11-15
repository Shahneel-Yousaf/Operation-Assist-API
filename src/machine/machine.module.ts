import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';

import {
  MachineManufacturerController,
  MachineTypeController,
} from './controllers';
import {
  Machine,
  MachineCondition,
  MachineConditionHistory,
  MachineManufacturer,
  MachineType,
  UserGroupMachineFavorite,
} from './entities';
import {
  MachineManufacturerRepository,
  MachineTypeRepository,
} from './repositories';
import { MachineService } from './services/machine.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      MachineType,
      MachineManufacturer,
      Machine,
      UserGroupMachineFavorite,
      MachineCondition,
      MachineConditionHistory,
    ]),
  ],
  providers: [
    MachineTypeRepository,
    MachineManufacturerRepository,
    BlobStorageService,
    MachineService,
    BlobStorageFileService,
  ],
  controllers: [MachineTypeController, MachineManufacturerController],
})
export class MachineModule {}
