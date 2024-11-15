import { MachineRelatedInfoOutput } from '@machine/dtos';
import { MachineService } from '@machine/services/machine.service';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';

import { MachineTypeController } from './machine-type.controller';

describe('MachineTypeController', () => {
  let controller: MachineTypeController;
  const mockedLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  const mockedMachineService = {
    getListMachineType: jest.fn(),
    getMachineRelatedInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineTypeController],
      providers: [
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: AppLogger,
          useValue: mockedLogger,
        },
        {
          provide: MachineService,
          useValue: mockedMachineService,
        },
      ],
    }).compile();

    controller = module.get<MachineTypeController>(MachineTypeController);
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get list machine type', () => {
    it('should return list machine type', async () => {
      const returnValues = [
        {
          machineTypeId: 'machineS2NCG2HXHP4R35R6J0N',
          machineTypeCode: 'code',
          typeName: 'name',
          pictureUrl: 'url',
        },
      ];
      mockedMachineService.getListMachineType.mockResolvedValue(returnValues);
      const groups = await controller.getListMachineType(ctx);
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedMachineService.getListMachineType).toHaveBeenCalledWith(ctx);
    });

    it('should return array of null', async () => {
      mockedMachineService.getListMachineType.mockResolvedValue([]);

      const groups = await controller.getListMachineType(ctx);
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when machineService fail', async () => {
      mockedMachineService.getListMachineType.mockRejectedValue(new Error());

      try {
        await controller.getListMachineType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get machine related info', () => {
    it('should return machine related info', async () => {
      const returnValues: MachineRelatedInfoOutput = {
        machineManufacturers: [
          {
            machineManufacturerId: 'manufacturerVJ029PHEJJ2QA4',
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
        validationSerialNumber: [
          {
            manufacturer: '<kmt id>',
            machineType: 'diffOther',
            regex:
              '^((\\d+)|((A|B|C|N|J|K|H|F|Y|NL)\\d+)|((DB|DZ)[a-zA-Z0-9]+))$',
            message: {
              ja: 'Mesage for jp language',
              enUS: 'Message for the English language',
            },
            maxLength: 8,
            uppercase: true,
            type: 'string',
          },
        ],
      };
      mockedMachineService.getMachineRelatedInfo.mockResolvedValue(
        returnValues,
      );

      const response = await controller.getMachineRelatedInfo(ctx);

      expect(response).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedMachineService.getListMachineType).toHaveBeenCalledWith(ctx);
    });

    it('should throw error when machineService fail', async () => {
      mockedMachineService.getMachineRelatedInfo.mockRejectedValue(new Error());

      try {
        await controller.getListMachineType(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
