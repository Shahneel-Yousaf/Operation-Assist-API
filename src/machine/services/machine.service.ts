import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import {
  MachineManufacturerOutput,
  MachineRelatedInfoOutput,
  MachineTypeOutput,
} from '@machine/dtos';
import {
  MachineManufacturerRepository,
  MachineTypeRepository,
} from '@machine/repositories';
import { Injectable } from '@nestjs/common';
import {
  MACHINE_MANUFACTURER_NAME_CUSTOM,
  MACHINE_TYPE_CODE_CUSTOM,
  SERIAL_NUMBER_VALID_FILE,
} from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MachineService {
  constructor(
    private readonly machineTypeRepository: MachineTypeRepository,
    private readonly machineManufacturerRepository: MachineManufacturerRepository,
    private readonly storageService: BlobStorageService,
    private readonly storageFileService: BlobStorageFileService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MachineService.name);
  }

  async getListMachineType(ctx: RequestContext): Promise<MachineTypeOutput[]> {
    this.logger.log(ctx, `${this.getListMachineType.name} was called`);

    const isoLocaleCode = ctx.isoLocaleCode;
    const machineTypes = await this.machineTypeRepository.find({
      where: {
        machineTypeTranslations: {
          isoLocaleCode,
        },
      },
      relations: ['machineTypeTranslations'],
    });

    return plainToInstance(
      MachineTypeOutput,
      machineTypes.map((machineType) => ({
        ...machineType,
        typeName: machineType.machineTypeTranslations[0].typeName,
        pictureUrl: this.storageService.generateSasUrl(machineType.pictureUrl),
        isOtherMachineType:
          machineType.machineTypeCode === MACHINE_TYPE_CODE_CUSTOM,
      })),
    );
  }

  async getListMachineManufacturer(
    ctx: RequestContext,
  ): Promise<MachineManufacturerOutput[]> {
    this.logger.log(ctx, `${this.getListMachineManufacturer.name} was called`);

    const machineManufacturers =
      await this.machineManufacturerRepository.find();

    return plainToInstance(
      MachineManufacturerOutput,
      machineManufacturers.map((machineManufacturer) => ({
        ...machineManufacturer,
        isOtherMachineManufacturer:
          machineManufacturer.machineManufacturerName ===
          MACHINE_MANUFACTURER_NAME_CUSTOM,
      })),
    );
  }

  async getMachineRelatedInfo(
    ctx: RequestContext,
  ): Promise<MachineRelatedInfoOutput> {
    this.logger.log(ctx, `${this.getMachineRelatedInfo.name} was called`);

    const isoLocaleCode = ctx.isoLocaleCode;
    const listMachineTypes = await this.machineTypeRepository.getMachineTypes(
      isoLocaleCode,
    );
    const listMachineManufacturers =
      await this.machineManufacturerRepository.find();
    const validationContent = await this.storageFileService.getFileContent(
      SERIAL_NUMBER_VALID_FILE,
    );

    const response = {
      machineManufacturers: listMachineManufacturers.map(
        (machineManufacturer) => ({
          ...machineManufacturer,
          isOtherMachineManufacturer:
            machineManufacturer.machineManufacturerName ===
            MACHINE_MANUFACTURER_NAME_CUSTOM,
        }),
      ),
      machineTypes: listMachineTypes.map((machineType) => ({
        machineTypeId: machineType.machineTypeId,
        machineTypeCode: machineType.machineTypeCode,
        typeName: machineType.machineTypeTranslations[0].typeName,
        pictureUrl: this.storageService.generateSasUrl(machineType.pictureUrl),
        isOtherMachineType:
          machineType.machineTypeCode === MACHINE_TYPE_CODE_CUSTOM,
      })),
      validationSerialNumber: JSON.parse(validationContent).serialNumber,
    };

    return plainToInstance(MachineRelatedInfoOutput, response);
  }
}
