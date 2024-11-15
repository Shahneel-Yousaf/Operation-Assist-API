import {
  GetMachineReportsOutput,
  GroupMachineParam,
  GroupMachineReportParam,
  MachineHistoriesOutput,
  MachineReportInput,
  MachineReportOutput,
  MachineReportResponseInput,
  PaginationInputQuery,
} from '@group/dtos';
import { Group } from '@group/entities';
import { GroupRepository } from '@group/repositories';
import { Inspection } from '@inspection/entities';
import { Machine } from '@machine/entities';
import {
  FuelMaintenanceReportInput,
  GetMachineReportsForWebappQuery,
  GetMachineSummaryQuery,
  GetReportFilterCountQuery,
  MachineOperationReportInput,
  MaintenanceReportInput,
  SyncMachineReportInput,
  SyncMachineReportOutput,
} from '@machine-report/dtos';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DevicePlatform,
  ISOLocaleCode,
  MachineHistoryType,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineReportType,
  Platform,
  StatusName,
} from '@shared/constants';
import { BaseApiResponse, UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';

import { MachineReportService } from '../services/machine-report.service';
import { MachineReportController } from './machine-report.controller';

const mockedMachineReportService = {
  getListMachineReport: jest.fn(),
  getMachineHistories: jest.fn(),
  updateMachineReportReadStatus: jest.fn(),
  createMachineReportResponse: jest.fn(),
  getMachineReportResponses: jest.fn(),
  createMachineReport: jest.fn(),
  getListMachineReportForWebapp: jest.fn(),
  getMachineReportDetail: jest.fn(),
  createMachineReportOffline: jest.fn(),
  getReportFilterCount: jest.fn(),
  createFuelMaintenanceReport: jest.fn(),
  createMachineOperationReport: jest.fn(),
  getMachineSummary: jest.fn(),
  getMachineOperationReportDetail: jest.fn(),
  getFuelMaintenanceReportDetail: jest.fn(),
  createMaintenanceReport: jest.fn(),
  getMaintenanceReportDetail: jest.fn(),
};
const mockedUserGroupAssignmentRepository = {
  checkPermissionInGroupSyncData: jest.fn(),
};
const mockUserRepository = {
  getUserDevicesInGroup: jest.fn(),
  getUserByCiam: jest.fn(),
};
const mockGroupRepository = {
  getGroupRelationships: jest.fn(),
};
const mockI18n = { t: jest.fn() };
const mockedLogger = {
  setContext: jest.fn(),
  log: jest.fn(),
};
const mockUserCiamLinkRepository = {
  userCiamLinkRepository: jest.fn(),
};
const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
const machineId = 'machineIdN9Q0KYA36EJ6PRQWE';
const machineTypeId = 'machineTypeD3DE0SAVCGDC8DMP74E';
const ctx = new RequestContext();
ctx.user = new UserAccessTokenClaims();
ctx.user.userId = userId;
ctx.user.isoLocaleCode = ISOLocaleCode.EN;
const group = new Group();
group.machines = [new Machine()];
group.machines[0].inspections = [new Inspection()];
group.machines[0].machineTypeId = machineTypeId;
describe('MachineReportController', () => {
  let controller: MachineReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineReportController],
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
          provide: I18nService,
          useValue: mockI18n,
        },
        {
          provide: MachineReportService,
          useValue: mockedMachineReportService,
        },
        {
          provide: UserGroupAssignmentRepository,
          useValue: mockedUserGroupAssignmentRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: GroupRepository,
          useValue: mockGroupRepository,
        },
        {
          provide: UserCiamLinkRepository,
          useValue: mockUserCiamLinkRepository,
        },
      ],
    }).compile();

    controller = module.get<MachineReportController>(MachineReportController);
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

  describe('getListMachineReport', () => {
    const mockRequestContext = new RequestContext();
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const mockQuery = new GetMachineReportsForWebappQuery();
    mockQuery.limit = 10;
    mockQuery.page = 1;

    it('should throw error when getListMachineReport service fail', async () => {
      mockedMachineReportService.getListMachineReport.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getListMachineReport(
          mockRequestContext,
          mockParams,
          mockQuery,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should getListMachineReport successfully', async () => {
      const mockGetMachineReportsOutput: GetMachineReportsOutput = {
        machineReportId: 'machineReport5DGBT31R2WD1T',
        givenName: 'given name',
        surname: 'surname',
        userPictureUrl: null,
        reportedAt: new Date(),
        reportTitle: 'test',
        reportType: MachineReportType.MACHINE,
        firstReportComment: '',
        reportCommentId: 'reportCommentGBT31R2WD1TSC',
        reportStatus: MachineReportCurrentStatus.POSTED,
        isRead: false,
        filePath: '',
        reportResponseStatus: MachineReportResponseStatus.RESOLVED,
        timeSinceCommentCreation: '7 hours ago.',
        serviceMeterInHour: 10,
      };

      const mockResponse = {
        meta: { pageInfo: { nextPage: false, limit: mockQuery.limit } },
        data: [mockGetMachineReportsOutput],
      };

      mockedMachineReportService.getListMachineReport.mockReturnValue(
        mockResponse,
      );

      const response = await controller.getListMachineReport(
        mockRequestContext,
        mockParams,
        mockQuery,
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });

  describe('updateMachineReportReadStatus', () => {
    const mockServiceResponse: BaseApiResponse<object> = {
      data: {},
      meta: {},
    };
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should throw error when updateMachineReportReadStatus service fail', async () => {
      mockedMachineReportService.updateMachineReportReadStatus.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateMachineReportReadStatus(ctx, mockParams);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should updateMachineReportReadStatus successfully', async () => {
      mockedMachineReportService.updateMachineReportReadStatus.mockResolvedValue(
        mockServiceResponse,
      );

      expect(
        controller.updateMachineReportReadStatus(ctx, mockParams),
      ).resolves.toStrictEqual(mockServiceResponse);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        ctx,
        'updateMachineReportReadStatus was called',
      );
    });
  });

  describe('getMachineReportResponses', () => {
    const mockRequestContext = new RequestContext();
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should throw error when getMachineReportResponses service fail', async () => {
      mockedMachineReportService.getMachineReportResponses.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getMachineReportResponses(
          mockRequestContext,
          mockParams,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should getMachineReportResponses successfully', async () => {
      const timeNow = new Date();
      const mockGetMachineReportResponseOutput = {
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        reportStatus: 'POSTED',
        reportResponseStatus: 'RESOLVED',
        machineReportResponses: [
          {
            userId: 'user36G1DX8P30W1RNSW0M4S0',
            givenName: 'givenName',
            surname: 'surname',
            userPictureUrl: null,
            machineReportResponseId: 'machineReportResponseRF8CTM',
            commentedAt: timeNow,
            timeSinceCommentCreation: '15 days ago',
            reportComment: 'comment',
            reportResponseStatus: 'RESOLVED',
            reportActionChoices: [
              {
                reportActionChoiceId: '0667RPVE4N1END6NE1V9QCHW8W',
                reportActionChoiceCode: 'SELF_REPAIR',
                isoLocaleCode: 'en',
                reportActionChoiceName: 'Self-repair',
              },
            ],
            machineReportMedias: [
              {
                machineReportMediaId: 'machineMedia92929XS0QG4',
                machineReportResponseId: 'machineReportResponseRF8CTM',
                fileName: 'file',
                mediaUrl: 'url',
                mimeType: 'mime',
                createdAt: timeNow,
              },
            ],
          },
        ],
      };

      const mockResponse = {
        meta: {},
        data: mockGetMachineReportResponseOutput,
      };

      mockedMachineReportService.getMachineReportResponses.mockReturnValue(
        mockGetMachineReportResponseOutput,
      );

      const response = await controller.getMachineReportResponses(
        mockRequestContext,
        mockParams,
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });

    describe('createMachineReport', () => {
      const params: GroupMachineParam = {
        groupId,
        machineId: 'machineIdN9Q0KYA36EJ6PRQWE',
      };
      const input: MachineReportInput = {
        reportTitle: 'report title',
        reportComment: 'report comment',
        machineReportMedias: [
          {
            fileName: 'file_name.png',
            mediaUrl: '/machine-reports/12345678-machine_name.png',
            filePath: '/machine-reports/12345678-machine_name.png',
            mimeType: 'image/bmp',
          },
        ],
        lat: 10,
        lng: 10,
        locationAccuracy: 'location accurracy',
        devicePlatform: DevicePlatform.IOS,
        serviceMeterInHour: 10,
      };
      const mockGroupContext = new Group();

      it('Should create machine report successfully', async () => {
        const mockMachineReport: MachineReportOutput = {
          machineReportId: 'machineReport0Z3EJ66E42KGXCCZ',
          reportTitle: 'string',
          firstReportComment: 'string',
          currentStatus: MachineReportCurrentStatus.POSTED,
          machineId: 'string',
        };

        mockI18n.t.mockReturnValue('Registered successfully.');

        mockedMachineReportService.createMachineReport.mockReturnValue(
          mockMachineReport,
        );

        const result = await controller.createMachineReport(
          ctx,
          params,
          input,
          mockGroupContext,
        );

        expect(result.data).toEqual(mockMachineReport);
        expect(result.meta).toEqual({
          successMessage: 'Registered successfully.',
        });
      });

      it('Should throw error when groupService.createMachineReport fail', async () => {
        mockedMachineReportService.createMachineReport.mockRejectedValue(
          new BadRequestException('Bad request error'),
        );

        try {
          await controller.createMachineReport(
            ctx,
            params,
            input,
            mockGroupContext,
          );
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toBe('Bad request error');
        }
      });
    });
  });

  describe('getMachineReportDetail', () => {
    const mockRequestContext = new RequestContext();
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should throw error when getMachineReportDetail service fail', async () => {
      mockedMachineReportService.getMachineReportDetail.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getMachineReportDetail(mockRequestContext, mockParams);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should getMachineReportDetail successfully', async () => {
      const timeNow = new Date();
      const mockGetMachineReportDetailOutput = {
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        reportStatus: 'POSTED',
        reportResponseStatus: 'RESOLVED',
        machineReportResponses: [
          {
            userId: 'user36G1DX8P30W1RNSW0M4S0',
            givenName: 'givenName',
            surname: 'surname',
            userPictureUrl: null,
            machineReportResponseId: 'machineReportResponseRF8CTM',
            commentedAt: timeNow,
            timeSinceCommentCreation: '15 days ago',
            reportComment: 'comment',
            reportResponseStatus: 'RESOLVED',
            machineReportMedias: [
              {
                machineReportMediaId: 'machineMedia92929XS0QG4',
                machineReportResponseId: 'machineReportResponseRF8CTM',
                fileName: 'file',
                mediaUrl: 'url',
                mimeType: 'mime',
                createdAt: timeNow,
              },
            ],
          },
        ],
      };

      const mockResponse = {
        meta: {},
        data: mockGetMachineReportDetailOutput,
      };

      mockedMachineReportService.getMachineReportDetail.mockReturnValue(
        mockGetMachineReportDetailOutput,
      );

      const response = await controller.getMachineReportDetail(
        mockRequestContext,
        mockParams,
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });

  describe('createMachineReportResponse', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;

    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    const mockInput: MachineReportResponseInput = {
      reportComment: 'reportComment',
      machineReportMedias: [
        {
          fileName: 'test.png',
          mediaUrl: 'image/test.png',
          filePath: 'image/test.png',
          mimeType: 'mime type',
        },
      ],
      status: MachineReportResponseStatus.RESOLVED,
      lat: 999.99,
      lng: 999.99,
      locationAccuracy: 'locationAccuracy',
      devicePlatform: DevicePlatform.ANDROID,
      reportActionChoiceIds: [
        'reportActionChoiceND6NE1V9',
        'reportActionChoice3Z0HXJG4',
      ],
    };

    const mockOutput = {
      machineReportResponseId: '01HJN0RJBX797KYSDQQ1AQM16M',
      reportComment: 'reportComment',
      commentedAt: '2023-12-27T06:53:01.000Z',
      machineReportId: '01HJ2HZJSZGJVBX9GGSGJ5EEEE',
      userId: '01HGCRQT8M4PF2Y8PTXN9Z4PFP',
      status: 'RESOLVED',
      lat: 999.99,
      lng: 999.99,
      locationAccuracy: 'locationAccuracy',
      devicePlatform: 'IOS',
    };
    const mockGroupContext = new Group();

    it('should throw error when createMachineReportResponse service fail', async () => {
      mockedMachineReportService.createMachineReportResponse.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.createMachineReportResponse(
          ctx,
          mockParams,
          mockInput,
          mockGroupContext,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should createMachineReportResponse successfully', async () => {
      mockedMachineReportService.createMachineReportResponse.mockReturnValue(
        mockOutput,
      );

      mockI18n.t.mockReturnValue('Status updated successfully.');

      const response = await await controller.createMachineReportResponse(
        ctx,
        mockParams,
        mockInput,
        mockGroupContext,
      );

      expect(response.meta).toEqual({
        successMessage: 'Status updated successfully.',
      });
      expect(response.data).toEqual(mockOutput);
    });
  });

  describe('Get list machine report for webapp', () => {
    const machineId = 'machineIdHTZ1EZY9T89DTDF6Q';
    const query = new GetMachineReportsForWebappQuery();
    query.limit = 10;
    query.page = 1;
    const header = Platform.WEBAPP;
    const mockParam: GroupMachineParam = { groupId, machineId };
    it('should return list of machine report webapp', async () => {
      const returnValues = {
        data: [
          {
            reportActions: [],
            machineReportId: 'machineReportId8C7KZ9X3J0A',
            givenName: 'givenName',
            surname: 'surname',
            userPictureUrl: null,
            reportType: 'MACHINE',
            reportedAt: '2024-01-24T07:14:29.000Z',
            reportTitle: 'aff',
            firstReportComment: 'abc',
            reportCommentId: 'reportCommentIdXCMHKXG441G',
            reportResponseStatus: 'RESOLVED',
            timeSinceCommentCreation: '1 hour ago',
            lat: 99,
            lng: 99,
          },
        ],
        meta: {
          pageInfo: {
            total: 1,
            page: 1,
            limit: 1,
            nextPage: false,
          },
          screenPermission: {
            allowEditDeleteGroup: true,
            allowCreateEditDeleteMachine: true,
            allowCreateEditDeleteMember: true,
            allowCreateEditDeleteInspectionForm: true,
            allowCreateInspectionAndReport: true,
          },
        },
      };

      mockedMachineReportService.getListMachineReportForWebapp.mockResolvedValue(
        returnValues,
      );

      const machineReports = await controller.getListMachineReport(
        ctx,
        mockParam,
        query,
        header,
      );

      expect(machineReports.data).toEqual(returnValues.data);
      expect(machineReports.meta).toEqual(returnValues.meta);
    });

    it('should throw error when machineReportService fail', async () => {
      mockedMachineReportService.getListMachineReportForWebapp.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.getListMachineReport(ctx, mockParam, query, header);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('createMachineReportOffline', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PRQWE',
    };
    const input: SyncMachineReportInput = {
      reportTitle: 'report title',
      reportComment: 'report comment',
      machineReportMedias: [
        {
          machineReportMediaId: 'mediaGFG1ET6W9Y1E0AZA2G5RA',
          fileName: 'file_name.png',
          mediaUrl: '/machine-reports/12345678-machine_name.png',
          filePath: '/machine-reports/12345678-machine_name.png',
          mimeType: 'image/bmp',
        },
      ],
      lat: 10,
      lng: 10,
      locationAccuracy: 'location accurracy',
      devicePlatform: DevicePlatform.IOS,
      machineReportId: 'machineReport0Z3EJ66E42KGXCCZ',
      machineReportResponseId: 'reportResponse0Z3EJ66E42DWE',
      lastStatusUpdatedAt: new Date(),
      serviceMeterInHour: 999.9,
    };

    it('Should create machine report successfully', async () => {
      const mockSyncMachineReport: SyncMachineReportOutput = {
        machineReportId: 'machineReport0Z3EJ66E42KGXCCZ',
        reportTitle: 'report title',
        firstReportComment: 'report comment',
        currentStatus: MachineReportCurrentStatus.POSTED,
        machineId: 'machineReport0Z3EJ66E42KGXCCZ',
        syncStatus: StatusName.SYNCED,
      };

      mockI18n.t.mockReturnValue('Registered successfully.');

      mockedMachineReportService.createMachineReportOffline.mockReturnValue(
        mockSyncMachineReport,
      );

      const result = await controller.createMachineReportOffline(
        group,
        ctx,
        params,
        input,
      );

      expect(result.data).toEqual(mockSyncMachineReport);
      expect(result.meta).toEqual({
        successMessage: 'Registered successfully.',
      });
    });

    it('Should throw error when groupService.createMachineReportOffline fail', async () => {
      mockedMachineReportService.createMachineReportOffline.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.createMachineReportOffline(group, ctx, params, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('createMachineOperationReport', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId,
    };
    const input: MachineOperationReportInput = {
      operationDetail: 'operationDetail',
      startAt: new Date(),
      lat: 10,
      lng: 10,
      locationAccuracy: 'location accurracy',
      devicePlatform: DevicePlatform.IOS,
      endAt: new Date(),
      comment: 'comment',
    };

    it('Should create machine operation report successfully', async () => {
      const mockMachineReport: MachineReportOutput = {
        machineReportId: 'machineReport0Z3EJ66E42KGXCCZ',
        reportTitle: 'string',
        firstReportComment: 'string',
        currentStatus: MachineReportCurrentStatus.POSTED,
        machineId: 'string',
      };

      mockedMachineReportService.createMachineOperationReport.mockReturnValue(
        mockMachineReport,
      );

      const result = await controller.createMachineOperationReport(
        ctx,
        params,
        input,
      );

      expect(result).toEqual({
        data: mockMachineReport,
        meta: {
          successMessage: 'Registered successfully.',
        },
      });
    });

    it('Should throw error when machineReportService.createMachineOperationReport fail', async () => {
      mockedMachineReportService.createMachineOperationReport.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.createMachineOperationReport(ctx, params, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('createFuelMaintenanceReport', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PRQWE',
    };
    const input: FuelMaintenanceReportInput = {
      locationAccuracy: 'location',
      devicePlatform: DevicePlatform.IOS,
      lat: 16.0805,
      lng: 108.23847,
      workAt: new Date(),
      fuelRefill: {
        fuelInLiters: 99.9,
        isAdblueRefilled: true,
        comment: '',
      },
    } as FuelMaintenanceReportInput;

    it('Should create fuel maintenance report successfully', async () => {
      const output = {
        machineReportId: '01J0N6CKTDST0VP2W1N25R0D59',
        reportTitle: 'Tan san create machine report',
        currentStatus: 'POSTED',
        machineId: '01HWC9A0CA7WR238X78WZ7F896',
      };

      mockedMachineReportService.createFuelMaintenanceReport.mockReturnValue(
        output,
      );

      const result = await controller.createFuelMaintenanceReport(
        ctx,
        params,
        input,
      );

      expect(result.data).toEqual(output);
    });

    it('Should throw error when machineReportService.createFuelMaintenanceReport fail', async () => {
      mockedMachineReportService.createFuelMaintenanceReport.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.createFuelMaintenanceReport(ctx, params, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('Get report filter count', () => {
    const machineId = 'machineIdHTZ1EZY9T89DTDF6Q';
    const query = new GetReportFilterCountQuery();
    query.startDate = dayjs().toDate();
    const mockParam: GroupMachineParam = { groupId, machineId };

    it('should return report filter count', async () => {
      const responseData = {
        reportCount: 41,
        fuelMaintenanceReportCount: 1,
        machineOperationReportCount: 0,
        incidentReportCount: 29,
        inspectionReportCount: 11,
      };

      mockedMachineReportService.getReportFilterCount.mockResolvedValue(
        responseData,
      );

      const response = await controller.getReportFilterCount(
        ctx,
        mockParam,
        query,
        group,
      );
      expect(response.data).toEqual(responseData);
    });

    it('should throw error when getReportFilterCount fail', async () => {
      mockedMachineReportService.getReportFilterCount.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.getReportFilterCount(ctx, mockParam, query, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getMachineOperationReportDetail', () => {
    const mockRequestContext = new RequestContext();
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should throw error when getMachineOperationReportDetail service fail', async () => {
      mockedMachineReportService.getMachineOperationReportDetail.mockRejectedValue(
        {
          message: 'Test error',
        },
      );

      try {
        await controller.getMachineOperationReportDetail(
          mockRequestContext,
          mockParams,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should return machine operation report detail successfully', async () => {
      const timeNow = new Date();
      const mockGetMachineOperationReportRes = {
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        subtype: 'MACHINE_OPERATION_REPORTS',
        userId: 'user36G1DX8P30W1RNSW0M4S0',
        givenName: 'givenName',
        surname: 'surname',
        userPictureUrl: null,
        machineReportResponseId: 'machineReportResponseRF8CTM',
        timeSinceCommentCreation: '15 days ago',
        lat: '0.123',
        lng: '0.123',
        locationAccuration: '',
        devicePlatform: 'IOS',
        startAt: '2024-06-04T03:31:19.000Z',
        endAt: '2024-06-04T03:31:19.000Z',
        operationDetail: 'operationDetail',
        comment: 'comment',
      };

      const mockResponse = {
        meta: {},
        data: mockGetMachineOperationReportRes,
      };
      mockedMachineReportService.getMachineOperationReportDetail.mockReturnValue(
        mockGetMachineOperationReportRes,
      );

      const response = await controller.getMachineOperationReportDetail(
        mockRequestContext,
        mockParams,
      );
      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });

  describe('Get machine summary', () => {
    const machineId = 'machineIdHTZ1EZY9T89DTDF6Q';
    const query = new GetMachineSummaryQuery();
    query.limit = 10;
    query.page = 1;
    const mockParam: GroupMachineParam = { groupId, machineId };
    it('should return list machine summary', async () => {
      const returnValues = {
        data: [
          {
            reportedId: '0DHCHJABDECZ3EJ66E42KGXC44',
            reportedAt: '2024-04-01T04:25:36.000Z',
            reportType: 'INCIDENT_REPORTS',
            reportTypeMessage: 'Abnormality/Issues',
            reportSubType: 'INSPECTION',
            reportItem: 'string',
            serviceMeter: null,
            givenName: 'abc',
            surname: 'sur',
            userPictureUrl: null,
            lat: null,
            lng: null,
          },
        ],
        meta: {
          pageInfo: {
            total: 1,
            page: 1,
            limit: 1,
            nextPage: false,
          },
          screenPermission: {
            allowEditDeleteGroup: true,
            allowCreateEditDeleteMachine: true,
            allowCreateEditDeleteMember: true,
            allowCreateEditDeleteInspectionForm: true,
            allowCreateInspectionAndReport: true,
          },
        },
      };

      mockedMachineReportService.getMachineSummary.mockResolvedValue(
        returnValues,
      );

      const machineReports = await controller.getMachineSummary(
        ctx,
        mockParam,
        query,
      );

      expect(machineReports.data).toEqual(returnValues.data);
      expect(machineReports.meta).toEqual(returnValues.meta);
    });

    it('should throw error when machineReportService fail', async () => {
      mockedMachineReportService.getMachineSummary.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.getMachineSummary(ctx, mockParam, query);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('GetFuelMaintenanceReportDetail', () => {
    const mockRequestContext = new RequestContext();
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('GetFuelMaintenanceReportDetail fail', async () => {
      mockedMachineReportService.getFuelMaintenanceReportDetail.mockRejectedValue(
        {
          message: 'Test error',
        },
      );

      try {
        await controller.getFuelMaintenanceReportDetail(
          mockRequestContext,
          mockParams,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('GetFuelMaintenanceReportDetail successfully', async () => {
      const mockGetFuelMaintenanceReportDetailOutput = {
        machineReportId: '01J19Z03FV823VGDSXQTS0QBRJ',
        reportTitle: '',
        subtype: 'FUEL_MAINTENANCE_REPORTS',
        userId: '01HHEJQ9B0KQAJTME49F9XA1D6',
        givenName: 'Account      test',
        surname: 'Chung Hiền 65',
        userPictureUrl:
          'https://opeappdevjpsaimgvid.blob.core.windows.net/contents/users/1714117135-JPEG_20240402_223134_2758654290404530706.jpeg?sv=2023-08-03&st=2024-06-26T10%3A30%3A30Z&se=2024-06-27T10%3A30%3A30Z&sr=b&sp=r&sig=qjN7elI9pCdwZEY4oEvSjm2DtsvWLg%2F3bFiLV1qJ6ds%3D',
        machineReportResponseId: '01J19Z03FWZNFANX85QQRFRV4F',
        timeSinceCommentCreation: '44 minutes ago',
        lat: 16.0805,
        lng: 108.23847,
        locationAccuracy: 'location',
        devicePlatform: 'IOS',
        workAt: '2015-03-24T17:00:00.000Z',
        serviceMeterInHour: 1,
        fuelRefill: {
          machineReportResponseId: '01J19Z03FWZNFANX85QQRFRV4F',
          fuelInLiters: 99,
          isAdblueRefilled: true,
          comment: '',
        },
      };

      const mockResponse = {
        meta: {},
        data: mockGetFuelMaintenanceReportDetailOutput,
      };
      mockedMachineReportService.getFuelMaintenanceReportDetail.mockReturnValue(
        mockGetFuelMaintenanceReportDetailOutput,
      );

      const response = await controller.getFuelMaintenanceReportDetail(
        mockRequestContext,
        mockParams,
      );
      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });

  describe('createMaintenanceReport', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PRQWE',
    };
    const input: MaintenanceReportInput = {
      locationAccuracy: 'location',
      devicePlatform: DevicePlatform.IOS,
      lat: 16.0805,
      lng: 108.23847,
      workAt: new Date(),
      serviceMeterInHour: 9.7,
      comment: 'comment',
      regularMaintenanceItemChoiceId: '01J1VTCXBG083S10XJCKHV2E9W',
      maintenanceReasonChoiceId: '01J1VXN50PQV3WVP84FRPXYR5R',
    } as MaintenanceReportInput;

    it('Should create maintenance report successfully', async () => {
      const output = {
        machineReportId: '01J1XT2JSQYZHW016YTBQP8DF0',
        reportTitle: '',
        currentStatus: 'POSTED',
        machineId: '01J05KG3BFFD4RKN9MQ64XNF7D',
      };

      mockedMachineReportService.createMaintenanceReport.mockReturnValue(
        output,
      );

      const result = await controller.createMaintenanceReport(
        ctx,
        params,
        input,
        group,
      );

      expect(result.data).toEqual(output);
    });

    it('Should throw error when machineReportService.createMaintenanceReport fail', async () => {
      mockedMachineReportService.createMaintenanceReport.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.createMaintenanceReport(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('GetMaintenanceReportDetail', () => {
    const mockRequestContext = new RequestContext();
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('GetMaintenanceReportDetail fail', async () => {
      mockedMachineReportService.getMaintenanceReportDetail.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getMaintenanceReportDetail(
          mockRequestContext,
          mockParams,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('GetMaintenanceReportDetail successfully', async () => {
      const mockGetMaintenanceReportDetailOutput = {
        machineReportId: '01J1YHWJVDN977ANAYVQ8HQBWH',
        reportItem: 'Every 100, 500, 2000h maintenance',
        reportedAt: '2024-07-04T09:40:55.000Z',
        userId: '01HTXVNMAGM2NVABX7HJ19KEAY',
        givenName: 'abc',
        surname: 'sur',
        userPictureUrl: null,
        timeSinceCommentCreation: '18 hours ago',
        workAt: '2024-07-04T19:48:25.210Z',
        serviceMeterInHour: 12.4,
        irregularMaintenanceItem: [],
        maintenanceReasonChoiceName: 'Service meter/SMR elapsed',
        maintenanceReasonPeriodChoiceName: '6 months',
        machineReportMedias: [
          {
            machineReportMediaId: '01J1YHWJY5P7V714FQH1BHB316',
            machineReportResponseId: '01J1YHWJVEQ56ZMQS2FXHB56F5',
            filePath: 'machine-reports/1709525195-image-test-1.jpeg',
            fileName: '1709525195-image-test-1.jpeg',
            mediaUrl:
              'https://storage-account-name.blob.core.windows.net/container-name/machine-reports/1709525195-image-test-1.jpeg?sv=2023-08-03&st=2024-07-05T03%3A54%3A31Z&se=2024-07-06T03%3A54%3A31Z&sr=b&sp=r&sig=vhf1K8ZbZ2aik01W1ZU3mFxbgXFQCCptDEgVIAOZxLo%3D',
            mimeType: 'mime type',
            createdAt: '2024-07-04T09:40:55.000Z',
            thumbnailUrl: null,
          },
        ],
        comment: 'comment',
      };

      const mockResponse = {
        meta: {},
        data: mockGetMaintenanceReportDetailOutput,
      };
      mockedMachineReportService.getMaintenanceReportDetail.mockReturnValue(
        mockGetMaintenanceReportDetailOutput,
      );

      const response = await controller.getMaintenanceReportDetail(
        mockRequestContext,
        mockParams,
      );
      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });
});
