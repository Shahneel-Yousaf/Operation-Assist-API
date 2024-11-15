import {
  GroupMachineParam,
  MachineHistoriesOutput,
  PaginationInputQuery,
} from '@group/dtos';
import { Group } from '@group/entities';
import { Inspection } from '@inspection/entities';
import { Machine } from '@machine/entities';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode, MachineHistoryType } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';

import { MachineReportService } from '../services/machine-report.service';
import { MachineReportControllerV1 } from './machine-report-v1.controller';

const mockedMachineReportService = {
  getMachineHistories: jest.fn(),
};
const mockedLogger = {
  setContext: jest.fn(),
  log: jest.fn(),
};

const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
const machineTypeId = 'machineTypeD3DE0SAVCGDC8DMP74E';
const ctx = new RequestContext();
ctx.user = new UserAccessTokenClaims();
ctx.user.userId = userId;
ctx.user.isoLocaleCode = ISOLocaleCode.EN;
const group = new Group();
group.machines = [new Machine()];
group.machines[0].inspections = [new Inspection()];
group.machines[0].machineTypeId = machineTypeId;
describe('MachineReportControllerV1', () => {
  let controller: MachineReportControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineReportControllerV1],
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
          provide: MachineReportService,
          useValue: mockedMachineReportService,
        },
      ],
    }).compile();

    controller = module.get<MachineReportControllerV1>(
      MachineReportControllerV1,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMachineHistories', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const query = new PaginationInputQuery();
    query.limit = 1;

    it('should throw error when getMachineHistories service fail', async () => {
      mockedMachineReportService.getMachineHistories.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getMachineHistories(ctx, mockParams, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should getMachineHistories successfully', async () => {
      const mockMachineHistoriesOutput: MachineHistoriesOutput = {
        machineHistoryId: 'machineHistoryJQXHQAC2DEQ0',
        machineHistoryType: MachineHistoryType.MACHINE_REPORTS,
        updateContent: 'title',
        eventAt: new Date(),
      };

      const mockResponse = {
        meta: { pageInfo: { nextPage: false } },
        data: [mockMachineHistoriesOutput],
      };

      mockedMachineReportService.getMachineHistories.mockReturnValue(
        mockResponse,
      );

      const response = await controller.getMachineHistories(
        ctx,
        mockParams,
        query,
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });
});
