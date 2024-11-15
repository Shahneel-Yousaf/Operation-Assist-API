import { MachineService } from '@machine/services/machine.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';

import { MachineManufacturerController } from './machine-manufacturer.controller';

describe('MachineManufacturerController', () => {
  let controller: MachineManufacturerController;

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  const mockedMachineService = {
    getListMachineManufacturer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineManufacturerController],
      providers: [
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

    controller = module.get<MachineManufacturerController>(
      MachineManufacturerController,
    );
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
      const mockOutput = [
        {
          machineManufacturerId: 'manufacturerVJ029PHEJJ2QA4',
          machineManufacturerName: 'manufacturer name',
        },
      ];
      mockedMachineService.getListMachineManufacturer.mockResolvedValue(
        mockOutput,
      );
      const machineManufacturers = await controller.getListMachineManufacturer(
        ctx,
      );
      expect(machineManufacturers).toEqual({
        data: mockOutput,
        meta: {},
      });
    });

    it('should return array of null', async () => {
      mockedMachineService.getListMachineManufacturer.mockResolvedValue([]);

      const machineManufacturers = await controller.getListMachineManufacturer(
        ctx,
      );
      expect(machineManufacturers.data).toHaveLength(0);
    });

    it('should throw error when machineService fail', async () => {
      mockedMachineService.getListMachineManufacturer.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.getListMachineManufacturer(ctx);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });
});
