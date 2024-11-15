import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import {
  MachineManufacturerRepository,
  MachineTypeRepository,
} from '@machine/repositories';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { UserCiamLinkRepository } from '@user/repositories';
import * as classTransformerModule from 'class-transformer';

import { MachineService } from './machine.service';

describe('MachineService', () => {
  let service: MachineService;

  const mockedMachineTypeRepository = {
    find: jest.fn(),
    getMachineTypes: jest.fn(),
  };

  const mockedMachineManufacturerRepository = {
    find: jest.fn(),
  };

  const mockBlobStorageService = {
    generateSasUrl: jest.fn(),
  };

  const mockBlobStorageFileService = {
    getFileContent: jest.fn(),
  };

  const mockUserCiamLinkRepository = {
    userCiamLinkRepository: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        MachineService,
        {
          provide: MachineTypeRepository,
          useValue: mockedMachineTypeRepository,
        },
        {
          provide: BlobStorageService,
          useValue: mockBlobStorageService,
        },
        {
          provide: BlobStorageFileService,
          useValue: mockBlobStorageFileService,
        },
        {
          provide: MachineManufacturerRepository,
          useValue: mockedMachineManufacturerRepository,
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
        {
          provide: UserCiamLinkRepository,
          useValue: mockUserCiamLinkRepository,
        },
      ],
    }).compile();

    service = module.get<MachineService>(MachineService);
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListMachineType', () => {
    it('get list machine types success', async () => {
      const mockMachineTypes = [
        {
          machineTypeId: 'machineS2NCG2HXHP4R35R6J0N',
          machineTypeCode: 'code',
          typeName: 'name',
          pictureUrl: 'url',
          isOtherMachineType: false,
          machineTypeTranslations: [
            {
              typeName: 'name',
            },
          ],
        },
      ];

      mockedMachineTypeRepository.find.mockResolvedValue(mockMachineTypes);

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockMachineTypes[0].pictureUrl,
      );

      expect(await service.getListMachineType(ctx)).toEqual(mockMachineTypes);
    });

    it('MachineTypeRepository find error', async () => {
      mockedMachineTypeRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListMachineType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getListMachineManufacturer', () => {
    it('get list machine manufacturers success', async () => {
      const mockMachineManufacturers = [
        {
          machineManufacturerId: 'manufacturer0TQCEVD0RMNAQM',
          machineManufacturerName: 'manufacturer name',
          isOtherMachineManufacturer: false,
        },
      ];

      mockedMachineManufacturerRepository.find.mockResolvedValue(
        mockMachineManufacturers,
      );

      expect(await service.getListMachineManufacturer(ctx)).toEqual(
        mockMachineManufacturers,
      );
    });

    it('should return error when MachineManufacturerRepository find fail', async () => {
      mockedMachineManufacturerRepository.find.mockRejectedValue(new Error());

      try {
        await service.getListMachineType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getMachineRelatedInfo', () => {
    it('get machine related info success', async () => {
      const mockMachineManufacturers = [
        {
          machineManufacturerId: 'manufacturer0TQCEVD0RMNAQM',
          machineManufacturerName: 'manufacturer name',
          isOtherMachineManufacturer: false,
        },
      ];
      const mockMachineTypes = [
        {
          machineTypeId: 'machineS2NCG2HXHP4R35R6J0N',
          machineTypeCode: 'code',
          typeName: 'name',
          pictureUrl: 'url',
          isOtherMachineType: false,
          machineTypeTranslations: [
            {
              typeName: 'name',
            },
          ],
        },
      ];

      mockedMachineTypeRepository.getMachineTypes.mockResolvedValue(
        mockMachineTypes,
      );
      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockMachineTypes[0].pictureUrl,
      );
      mockedMachineManufacturerRepository.find.mockResolvedValue(
        mockMachineManufacturers,
      );
      const validationContent = '{"key":"value"}';
      const serialNumberValidation =
        mockBlobStorageFileService.getFileContent.mockReturnValue(
          validationContent,
        );
      const mockJsonParse = jest.spyOn(JSON, 'parse');
      const validationSerialNumber = mockJsonParse.mockImplementationOnce(
        () => serialNumberValidation,
      );

      const returnValues = {
        machineManufacturers: [
          {
            machineManufacturerId: 'manufacturer0TQCEVD0RMNAQM',
            machineManufacturerName: 'manufacturer name',
            isOtherMachineManufacturer: false,
          },
        ],
        machineTypes: [
          {
            machineTypeId: 'machineS2NCG2HXHP4R35R6J0N',
            machineTypeCode: 'code',
            typeName: 'name',
            pictureUrl: 'url',
            isOtherMachineType: false,
          },
        ],
        validationSerialNumber: validationSerialNumber,
      };
      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues),
      });

      expect(await service.getMachineRelatedInfo(ctx)).toBe(returnValues);
      mockJsonParse.mockRestore();
    });

    it('MachineTypeRepository find error', async () => {
      mockedMachineTypeRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListMachineType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return error when MachineManufacturerRepository find fail', async () => {
      mockedMachineTypeRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListMachineType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
