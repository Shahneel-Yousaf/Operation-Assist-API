import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import { createMock } from '@golevelup/ts-jest';
import {
  GetMachineReportsOutput,
  GroupMachineParam,
  GroupMachineReportParam,
  MachineHistoriesOutput,
  MachineHistoryOutputDto,
  MachineReportInput,
  MachineReportResponseInput,
  PaginationInputQuery,
} from '@group/dtos';
import { Group } from '@group/entities';
import { GroupRepository } from '@group/repositories';
import { Inspection } from '@inspection/entities';
import { Machine } from '@machine/entities';
import { MachineRepository } from '@machine/repositories';
import {
  FuelMaintenanceReportInput,
  GetMachineReportsForWebappQuery,
  GetMachineSummaryQuery,
  GetReportFilterCountQuery,
  MachineOperationReportInput,
  MaintenanceReportInput,
  SyncMachineReportInput,
} from '@machine-report/dtos';
import {
  FuelMaintenanceReport,
  FuelRefill,
  MachineOperationReport,
  MachineReport,
  MachineReportHistory,
  MachineReportResponse,
  MachineReportUserRead,
} from '@machine-report/entities';
import {
  MachineReportHistoryRepository,
  MachineReportRepository,
  MachineReportUserReadRepository,
} from '@machine-report/repositories';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DevicePlatform,
  ISOLocaleCode,
  MachineCurrentStatus,
  MachineHistoryType,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineReportType,
  MachineSummaryType,
  Version,
} from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  IrregularMaintenanceItemChoiceRepository,
  MaintenanceReasonChoiceRepository,
  MaintenanceReasonPeriodChoiceRepository,
  RegularMaintenanceItemChoiceRepository,
  ReportActionChoiceRepository,
} from '@template/repositories';
import {
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';
import * as classTransformerModule from 'class-transformer';
import * as dayjs from 'dayjs';
import { I18nService } from 'nestjs-i18n';
import { DataSource } from 'typeorm';

import { convertTimezoneToUTC } from '../../shared/utils/commons';
import { MachineReportService } from './machine-report.service';

jest.mock('../../shared/utils/commons');
let dataSource: DataSource;
const mockI18n = { t: jest.fn() };
const mockBlobStorageService = { generateSasUrl: jest.fn() };

const mockedRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  getListGroupByIds: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  getGroupDetailById: jest.fn(),
};

const mockMachineReportRepository = {
  getListMachineReport: jest.fn(),
  findOne: jest.fn(),
  getMachineReportDetail: jest.fn(),
  getListMachineReportForWebapp: jest.fn(),
  countMachineReportForWebapp: jest.fn(),
  getMachineReportInfo: jest.fn(),
  getReportActionChoiceForWebapp: jest.fn(),
  getListMachineSummary: jest.fn(),
  countReportSummary: jest.fn(),
  getMachineOperationReportDetail: jest.fn(),
  countMachineReport: jest.fn(),
  getFuelMaintenanceReportDetail: jest.fn(),
  getMaintenanceReportDetail: jest.fn(),
};

const mockMachineRepository = {
  getMachinesInGroup: jest.fn(),
  getMachinesByMachineIds: jest.fn(),
  checkMachineExistsInGroup: jest.fn(),
  groupMachineSuggestions: jest.fn(),
  getMachineDetailInfo: jest.fn(),
  findOne: jest.fn(),
  checkListMachinesAssigned: jest.fn(),
  getMachinesGroupByIds: jest.fn(),
  getMachineInGroup: jest.fn(),
  getMachineInGroupById: jest.fn(),
  getMachineHistories: jest.fn(),
  getMachineReportById: jest.fn(),
  getUserMachineGroup: jest.fn(),
};

const mockMachineReportUserReadRepository = {
  findOne: jest.fn(),
  insert: jest.fn(),
  create: jest.fn(),
};

const mockMachineReportHistoryRepository = {
  getListMachineHistories: jest.fn(),
};

const mockFirebaseService = {
  createNotifications: jest.fn(),
  sendNotificationsByLocalCode: jest.fn(),
};

const mockUserRepository = {
  getUserDevicesInGroup: jest.fn(),
  getUserByCiam: jest.fn(),
};

const mockReportActionChoiceRepository = {
  find: jest.fn(),
};

const mockGroupRepository = {
  getGroupRelationships: jest.fn(),
};

const mockedUserGroupAssignmentRepository = {
  checkPermissionInGroupSyncData: jest.fn(),
};

const mockedIMICRepository = {
  find: jest.fn(),
};

const mockedRMICRepository = {
  findOne: jest.fn(),
};

const mockedMRPCRepository = {
  findOne: jest.fn(),
};

const mockedMRCRepository = {
  findOne: jest.fn(),
};

const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
const machineId = 'machineIdN9Q0KYA36EJ6PASDF';
const machineTypeId = 'machineTypeD3DE0SAVCGDC8DMP74E';
const ctx = new RequestContext();
ctx.user = new UserAccessTokenClaims();
ctx.user.userId = userId;
ctx.user.isoLocaleCode = ISOLocaleCode.EN;
const group = new Group();
group.machines = [new Machine()];
group.machines[0].inspections = [new Inspection()];
group.machines[0].machineTypeId = machineTypeId;
describe('MachineReportService', () => {
  let service: MachineReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachineReportService,
        ConfigService,
        {
          provide: MachineReportRepository,
          useValue: mockedRepository,
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn(), error: jest.fn() },
        },
        {
          provide: I18nService,
          useValue: mockI18n,
        },
        {
          provide: DataSource,
          useValue: createMock<DataSource>(),
        },
        {
          provide: BlobStorageService,
          useValue: mockBlobStorageService,
        },
        {
          provide: MachineReportRepository,
          useValue: mockMachineReportRepository,
        },
        {
          provide: MachineReportUserReadRepository,
          useValue: mockMachineReportUserReadRepository,
        },
        {
          provide: MachineReportHistoryRepository,
          useValue: mockMachineReportHistoryRepository,
        },
        {
          provide: MachineRepository,
          useValue: mockMachineRepository,
        },
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: ReportActionChoiceRepository,
          useValue: mockReportActionChoiceRepository,
        },
        {
          provide: GroupRepository,
          useValue: mockGroupRepository,
        },
        {
          provide: UserGroupAssignmentRepository,
          useValue: mockedUserGroupAssignmentRepository,
        },
        {
          provide: IrregularMaintenanceItemChoiceRepository,
          useValue: mockedIMICRepository,
        },
        {
          provide: RegularMaintenanceItemChoiceRepository,
          useValue: mockedRMICRepository,
        },
        {
          provide: MaintenanceReasonPeriodChoiceRepository,
          useValue: mockedMRPCRepository,
        },
        {
          provide: MaintenanceReasonChoiceRepository,
          useValue: mockedMRCRepository,
        },
      ],
    }).compile();

    service = module.get<MachineReportService>(MachineReportService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getListMachineReport', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const query = new PaginationInputQuery();
    query.limit = 1;
    query.firstRequestTime = new Date();

    it('should getListMachineReport successfully', async () => {
      jest.mock('class-transformer');
      const mockMachine = new Machine();
      mockMachineRepository.getMachineInGroupById.mockReturnValue(mockMachine);

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
        meta: {
          pageInfo: {
            nextPage: false,
            limit: query.limit,
            firstRequestTime: query.firstRequestTime,
            page: 1,
          },
        },
        data: [mockGetMachineReportsOutput],
      };

      mockMachineReportRepository.getListMachineReport.mockReturnValue(
        mockResponse.data,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse.data),
      });

      const responses = await service.getListMachineReport(
        mockRequestContext,
        mockParams,
        query,
      );

      expect(responses.meta).toEqual(mockResponse.meta);
      expect(responses.data).toEqual(mockResponse.data);
    });

    it('should throw NotFoundException when machine not found', async () => {
      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(undefined);

      try {
        await service.getListMachineReport(
          mockRequestContext,
          mockParams,
          query,
        );
      } catch (error) {
        expect(error.message).toBe('Machine not found.');
      }
    });

    it('should throw NotFoundException when machine deleted', async () => {
      const mockCheckMachineExist = {
        machineId: 'machine01HD0E2GAANRQ80VJZDEW',
        currentStatus: 'DELETED',
      };
      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(mockCheckMachineExist);

      mockI18n.t.mockReturnValue('Already deleted.');

      try {
        await service.getListMachineReport(
          mockRequestContext,
          mockParams,
          query,
        );
      } catch (error) {
        expect(error.response.customMessage).toBe('Already deleted.');
      }
    });
  });

  describe('updateMachineReportReadStatus', () => {
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should throw NotFoundException when machine not found.', async () => {
      mockMachineRepository.getMachineReportById.mockReturnValue(undefined);
      mockMachineRepository.getMachineInGroupById.mockReturnValue({
        machineId: 'machine01HD0E2GAANRQ80VJZDEW',
        currentStatus: MachineCurrentStatus.CREATED,
      });
      try {
        await service.updateMachineReportReadStatus(ctx, mockParams);
      } catch (error) {
        expect(error.message).toBe('Machine report not found.');
        expect(error.response.statusCode).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should update machine read status success', async () => {
      const mockMachineReport = {
        machineId: '01HH48WYB6X3X74AKQMNDXEEBG',
        machineName: 'machine name',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'picture url',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'model',
        serialNumber: '123123124',
        serialNumberPlatePictureUrl: 'plate picture url',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: new Date(),
      };

      mockMachineRepository.getMachineReportById.mockReturnValue(
        mockMachineReport,
      );

      jest
        .spyOn(mockMachineReportUserReadRepository, 'findOne')
        .mockReturnValue(undefined);

      await service.updateMachineReportReadStatus(ctx, mockParams);

      expect(mockMachineReportUserReadRepository.insert).toHaveBeenCalled();
      expect(mockMachineReportUserReadRepository.create).toHaveBeenCalled();
    });
  });

  describe('getMachineHistories', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const query = new PaginationInputQuery();
    query.limit = 1;
    query.firstRequestTime = new Date();

    it('should getMachineHistories successfully', async () => {
      const mockMachineReportHistories: MachineHistoryOutputDto[] = [
        {
          machineHistoryType: MachineHistoryType.MACHINE_REPORTS,
          machineHistoryId: 'machineHistoryJQXHQAC2DEQ0',
          givenName: 'given name',
          surname: 'surname',
          eventAt: new Date(),
          currentStatus: MachineReportCurrentStatus.POSTED,
          inspectionFormName: '',
          status: MachineReportResponseStatus.UNADDRESSED,
          subtype: '',
        },
      ];

      const mockMachineHistoriesOutput: MachineHistoriesOutput = {
        machineHistoryId: 'machineHistoryJQXHQAC2DEQ0',
        machineHistoryType: MachineHistoryType.MACHINE_REPORTS,
        eventAt: new Date(),
        updateContent: 'message',
      };

      const mockResponse = {
        meta: {
          pageInfo: {
            nextPage: false,
            limit: query.limit,
            page: 1,
            firstRequestTime: query.firstRequestTime,
          },
        },
        data: [mockMachineHistoriesOutput],
      };

      mockMachineReportHistoryRepository.getListMachineHistories.mockReturnValue(
        mockMachineReportHistories,
      );

      const mockService = {
        handleUpdateContent: jest.fn(),
      };
      mockService.handleUpdateContent(
        mockMachineReportHistories,
        ctx.user,
        Version.V1,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse.data),
      });

      const responses = await service.getMachineHistories(
        ctx,
        mockParams,
        query,
      );

      expect(responses.meta).toEqual(mockResponse.meta);
      expect(responses.data).toEqual(mockResponse.data);
    });

    it('should throw NotFoundException when machine not found', async () => {
      mockMachineRepository.getMachineDetailInfo.mockResolvedValue(null);

      jest
        .spyOn(mockMachineReportHistoryRepository, 'getListMachineHistories')
        .mockReturnValue([]);

      try {
        await service.getMachineHistories(ctx, mockParams, query);
      } catch (error) {
        expect(error.message).toBe('Machine not found.');
        expect(error.response.statusCode).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw BadRequestException when machine already deleted', async () => {
      const mockMachine = {
        machineId: mockParams.machineId,
        currentStatus: 'DELETED',
      };

      mockMachineRepository.getMachineDetailInfo.mockResolvedValue(mockMachine);

      jest
        .spyOn(mockMachineReportHistoryRepository, 'getListMachineHistories')
        .mockReturnValue([]);

      try {
        await service.getMachineHistories(ctx, mockParams, query);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.response.customMessage).toBe('Already deleted.');
      }
    });
  });

  describe('createMachineReport', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PASDF',
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

    it('should return NotFoundException when the request form must have at least one field.', async () => {
      const input: MachineReportInput = {
        reportTitle: 'report title',
        reportComment: '',
        machineReportMedias: [],
        lat: 10,
        lng: 10,
        locationAccuracy: 'location accurracy',
        devicePlatform: DevicePlatform.IOS,
        serviceMeterInHour: 10,
      };

      try {
        await service.createMachineReport(ctx, params, input, mockGroupContext);
      } catch (error) {
        expect(error.message).toEqual(
          'The request form must have at least one field.',
        );
      }
    });

    it('should create machine report success', async () => {
      const machine = {
        machineId: 'machineMZAXTGT8XEXMY6791A37E',
        machineName: 'machine3',
        pictureUrl: 'string',
        modelAndType: 'DFSEFRE',
        serialNumber: 'qwe',
        serialNumberPlatePictureUrl: '',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
        group: {
          groupId: 'group1QCXK4HJ9KS6HCG6RW6CQ',
          groupName: 'group name',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-15T02:38:04.000Z',
          companyName: 'company name',
        },
      };

      mockMachineRepository.getUserMachineGroup.mockReturnValue(machine);

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineReportRepo = mockDataSource.getRepository(MachineReport);
      const machineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const machineReportUserReadRepo = mockDataSource.getRepository(
        MachineReportUserRead,
      );
      const machineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);

      jest
        .spyOn(mockFirebaseService, 'createNotifications')
        .mockReturnValue({});

      await service.createMachineReport(ctx, params, input, mockGroupContext);

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineReportRepo.insert).toHaveBeenCalled();
      expect(machineReportResponseRepo.insert).toHaveBeenCalled();
      expect(machineReportUserReadRepo.insert).toHaveBeenCalled();
      expect(machineReportHistoryRepo.insert).toHaveBeenCalled();
    });
  });

  describe('creationTimeDuration', () => {
    it('should creationTimeDuration success', async () => {
      const mockTimeAt = new Date('2023-12-26T07:20:38.252Z');
      const mockTimeNow = new Date('2023-12-26T08:20:38.252Z');

      mockI18n.t.mockReturnValue('1 hour ago');

      const output = service.creationTimeDuration(
        ISOLocaleCode.EN,
        mockTimeAt,
        mockTimeNow,
      );

      expect(output).toBe('1 hour ago');
    });
  });

  describe('getMachineReportResponses', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should getMachineReportResponses successfully', async () => {
      jest.mock('class-transformer');
      const timeNow = new Date();
      const mockGetMachineReportResponseOutput = {
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        reportStatus: 'POSTED',
        reportResponseStatus: 'RESOLVED',
        machineReportUserReads: [],
        machineReportResponses: [
          {
            machineReportResponseId: 'machineReportResponseRF8CTM',
            commentedAt: timeNow,
            timeSinceCommentCreation: '15 days ago',
            reportComment: 'comment',
            reportResponseStatus: 'RESOLVED',
            user: {
              userId: 'user36G1DX8P30W1RNSW0M4S0',
              givenName: 'givenName',
              surname: 'surname',
              pictureUrl: null,
            },
            reportActions: [
              {
                reportActionChoiceId: '0667RPVE4N1END6NE1V9QCHW8W',
                reportActionChoiceCode: 'SELF_REPAIR',
                reportActionChoice: {
                  isoLocaleCode: 'en',
                },
                reportActionChoiceTranslation: {
                  reportActionChoiceName: 'Self-repair',
                },
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
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        reportStatus: 'POSTED',
        reportResponseStatus: 'RESOLVED',
        isRead: false,
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

      mockMachineRepository.getMachineInGroupById.mockReturnValue({
        machineId: 'machine01HD0E2GAANRQ80VJZDEW',
        currentStatus: MachineCurrentStatus.CREATED,
      });

      mockMachineReportRepository.getMachineReportDetail.mockReturnValue(
        mockGetMachineReportResponseOutput,
      );
      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse),
      });
      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockGetMachineReportResponseOutput.machineReportResponses[0].user
          .pictureUrl,
      );

      const responses = await service.getMachineReportResponses(
        mockRequestContext,
        mockParams,
      );

      expect(responses).toEqual(mockResponse);
    });
  });

  describe('getMachineReportDetail', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should getMachineReportDetail successfully', async () => {
      jest.mock('class-transformer');
      const timeNow = new Date();
      const mockGetMachineReportDetailOutput = {
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        reportStatus: 'POSTED',
        reportResponseStatus: 'RESOLVED',
        machineReportUserReads: [],
        machineReportResponses: [
          {
            machineReportResponseId: 'machineReportResponseRF8CTM',
            commentedAt: timeNow,
            timeSinceCommentCreation: '15 days ago',
            reportComment: 'comment',
            reportResponseStatus: 'RESOLVED',
            user: {
              userId: 'user36G1DX8P30W1RNSW0M4S0',
              givenName: 'givenName',
              surname: 'surname',
              pictureUrl: null,
            },
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
        machineReportId: 'machineReportC9VE78BJ8',
        reportedAt: timeNow,
        reportTitle: 'title',
        reportStatus: 'POSTED',
        reportResponseStatus: 'RESOLVED',
        isRead: false,
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

      mockMachineRepository.getMachineInGroupById.mockReturnValue({
        machineId: 'machine01HD0E2GAANRQ80VJZDEW',
        currentStatus: MachineCurrentStatus.CREATED,
      });

      mockMachineReportRepository.getMachineReportInfo.mockReturnValue(
        mockGetMachineReportDetailOutput,
      );
      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse),
      });
      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockGetMachineReportDetailOutput.machineReportResponses[0].user
          .pictureUrl,
      );

      const responses = await service.getMachineReportDetail(
        mockRequestContext,
        mockParams,
      );

      expect(responses).toEqual(mockResponse);
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

    const mockInput = {
      reportComment: 'reportComment',
      status: MachineReportResponseStatus.RESOLVED,
      lat: 999.99,
      lng: 999.99,
      locationAccuracy: 'locationAccuracy',
      devicePlatform: DevicePlatform.ANDROID,
    } as MachineReportResponseInput;

    const mockMachineReport = new MachineReport();
    const mockMachine = new Machine();
    const mockGroupContext = new Group();
    mockGroupContext.machines = [
      {
        machineName: 'machine name',
        machineReports: [{}],
      } as Machine,
    ];

    it('should return action choice is invalid.', async () => {
      const input = {
        reportActionChoiceIds: ['choice12J34D8MAJ2SZZHN32ZB0'],
        status: MachineReportResponseStatus.UNADDRESSED,
        reportComment: '',
        machineReportMedias: [],
        lat: 0,
        lng: 0,
        locationAccuracy: '',
        devicePlatform: DevicePlatform.IOS,
      };

      mockReportActionChoiceRepository.find.mockReturnValue([]);

      try {
        await service.createMachineReportResponse(
          ctx,
          mockParams,
          input,
          mockGroupContext,
        );
      } catch (error) {
        expect(error.message).toEqual('Action choice is invalid.');
      }
    });

    it('should createMachineReportResponse successfully', async () => {
      mockMachineRepository.getMachineInGroupById.mockReturnValue(mockMachine);
      mockMachineReportRepository.findOne.mockReturnValue(mockMachineReport);

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineReportRepo = mockDataSource.getRepository(MachineReport);
      const machineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const machineReportResponseRepo: MachineReportResponse =
        mockDataSource.getRepository(MachineReportResponse);
      const machineReportUserReadRepo = mockDataSource.getRepository(
        MachineReportUserRead,
      );

      mockFirebaseService.sendNotificationsByLocalCode.mockResolvedValue(
        undefined,
      );

      await service.createMachineReportResponse(
        ctx,
        mockParams,
        mockInput,
        mockGroupContext,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineReportRepo.update).toHaveBeenCalled();
      expect(machineReportResponseRepo.save).toHaveBeenCalled();
      expect(machineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(machineReportUserReadRepo.delete).toHaveBeenCalled();
      expect(machineReportUserReadRepo.insert).toHaveBeenCalled();
    });
  });

  describe('createMachineReportOffline', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PASDF',
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
    const mockUser = {
      userId: '01HK6T59RA54XRCP4Y0XXDS1GJ',
      searchId: '963918311',
      givenName: 'datbui',
      surname: 'dat',
      pictureUrl: 'string',
      email:
        'sdnv1@gmail.com_deleted_at_1708573661_deleted_at_1708573686_deleted_at_1708573734',
      isSearchableByEmail: true,
      registeredAt: '2024-01-03T04:43:58.000Z',
      isoLocaleCode: 'ja',
      residenceCountryCode: 'JP',
      dateOfBirth: '2024',
      currentStatus: 'CREATED',
      lastStatusUpdatedAt: '2025-02-22T03:48:54.000Z',
    };
    const mockUserGroupAssignment = {
      userId: '01HK6T59RA54XRCP4Y0XXDS1GJ',
      groupId: 'tesst                     ',
      lastStatusUpdatedAt: '2024-03-08T02:32:16.000Z',
      currentStatus: 'ASSIGNED',
      userGroupRoleName: '',
      isAdmin: true,
      userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
      userGroupPermissionAssignments: [
        {
          userId: '01HK6T59RA54XRCP4Y0XXDS1GJ',
          groupId: 'tesst                     ',
          permissionId: '065BDR71D53H2ZBB5RA7334MC4',
          assignedAt: '2024-03-08T02:32:16.000Z',
          permission: [
            {
              permissionId: '065BDR71D53H2ZBB5RA7334MC4',
              resourceId: '065BBX65G14M29P07VHX8EWBP4',
              operationId: '065BBWVZV2KJHBD0WT6T33NQZ8',
              operation: {
                operationId: '065BBWVZV2KJHBD0WT6T33NQZ8',
                operationCode: 'READ_CREATE',
              },
              resource: {
                resourceId: '065BBX65G14M29P07VHX8EWBP4',
                resourceCode: 'INSPECTIONS_AND_MACHINE_REPORTS',
              },
            },
          ],
        },
      ],
    };

    it('should return NotFoundException when the request form must have at least one field.', async () => {
      const input: SyncMachineReportInput = {
        reportTitle: 'report title',
        reportComment: 'report comment',
        machineReportMedias: [],
        lat: 10,
        lng: 10,
        locationAccuracy: 'location accurracy',
        devicePlatform: DevicePlatform.IOS,
        machineReportId: 'machineReport0Z3EJ66E42KGXCCZ',
        machineReportResponseId: 'reportResponse0Z3EJ66E42DWE',
        lastStatusUpdatedAt: new Date(),
        serviceMeterInHour: 99.9,
      };
      const mockGroup = new Group();
      mockGroup.machines = [
        {
          machineName: 'machine name',
        } as Machine,
      ];
      mockGroupRepository.getGroupRelationships.mockReturnValue(mockGroup);
      jest.spyOn(mockUserRepository, 'getUserByCiam').mockReturnValue(mockUser);
      jest
        .spyOn(
          mockedUserGroupAssignmentRepository,
          'checkPermissionInGroupSyncData',
        )
        .mockReturnValue(mockUserGroupAssignment);
      try {
        await service.createMachineReportOffline(group, ctx, params, input);
      } catch (error) {
        expect(error.message).toEqual(
          'The request form must have at least one field.',
        );
      }
    });

    it('should create machine report success', async () => {
      const machine = {
        machineId: 'machineMZAXTGT8XEXMY6791A37E',
        machineName: 'machine3',
        pictureUrl: 'string',
        modelAndType: 'DFSEFRE',
        serialNumber: 'qwe',
        serialNumberPlatePictureUrl: '',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
        group: {
          groupId: 'group1QCXK4HJ9KS6HCG6RW6CQ',
          groupName: 'group name',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-15T02:38:04.000Z',
          companyName: 'company name',
        },
      };

      mockMachineRepository.getUserMachineGroup.mockReturnValue(machine);

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineReportRepo = mockDataSource.getRepository(MachineReport);
      const machineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const machineReportUserReadRepo = mockDataSource.getRepository(
        MachineReportUserRead,
      );
      const machineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);

      jest
        .spyOn(mockFirebaseService, 'createNotifications')
        .mockReturnValue({});

      await service.createMachineReportOffline(group, ctx, params, input);

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineReportRepo.insert).toHaveBeenCalled();
      expect(machineReportResponseRepo.insert).toHaveBeenCalled();
      expect(machineReportUserReadRepo.insert).toHaveBeenCalled();
      expect(machineReportHistoryRepo.insert).toHaveBeenCalled();
    });

    it('duplicate data return synced', async () => {
      const machine = {
        machineId: 'machineMZAXTGT8XEXMY6791A37E',
        machineName: 'machine3',
        pictureUrl: 'string',
        modelAndType: 'DFSEFRE',
        serialNumber: 'qwe',
        serialNumberPlatePictureUrl: '',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
        group: {
          groupId: 'group1QCXK4HJ9KS6HCG6RW6CQ',
          groupName: 'group name',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-15T02:38:04.000Z',
          companyName: 'company name',
        },
      };

      mockMachineRepository.getUserMachineGroup.mockReturnValue(machine);

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockRejectedValue({ message: 'Error: Violation of PRIMARY KEY' });

      await service.createMachineReportOffline(group, ctx, params, input);

      expect(spyTransaction).toHaveBeenCalled();
    });
  });

  describe('handlePushNotiForMachineReport', () => {
    const machineId = 'machineZX37GHRDWY84ECWAW17Q';

    it('handlePushNotiForMachineReport not push notification', async () => {
      const group = new Group();
      const machineReport = new MachineReport();
      mockUserRepository.getUserDevicesInGroup.mockResolvedValue([]);

      expect(
        await service.handlePushNotiForMachineReport(
          ctx,
          groupId,
          machineId,
          group,
          machineReport,
        ),
      ).toEqual(undefined);
    });

    it('handlePushNotiForMachineReport push notification success', async () => {
      const mockGroupContext = new Group();
      mockGroupContext.groupName = 'group name';
      mockGroupContext.machines = [
        {
          machineName: 'machine name',
        } as Machine,
      ];

      const mockMachineReport = new MachineReport();
      mockMachineReport.machineReportId = 'machineReportQ3F4FCWR4G4WG';
      mockMachineReport.currentStatus = MachineReportCurrentStatus.POSTED;
      mockMachineReport.lastMachineReportResponseId =
        'reportResponseQ3F4FCWR4GDE4';
      const mockUserDevicesInGroup = [
        {
          userId,
          searchId: '963918312',
          givenName: 'given name',
          surname: 'sur name',
          pictureUrl: 'string',
          email: 'user@example.com',
          isSearchableByEmail: true,
          registeredAt: '2024-01-03T04:43:58.000Z',
          isoLocaleCode: 'en',
          residenceCountryCode: 'JP',
          dateOfBirth: '2023',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2024-01-03T04:44:10.000Z',
          devices: [
            {
              deviceId: 'deviceEPMW006MTVKPV7029EECM',
              userId,
              deviceType: 'IOS',
              fcmToken: 'token',
              lastActiveAt: '2024-01-26T02:19:13.000Z',
              currentStatus: 'CREATED',
              lastStatusUpdatedAt: '2024-01-26T02:19:13.000Z',
            },
          ],
        },
      ];

      mockUserRepository.getUserDevicesInGroup.mockReturnValue(
        mockUserDevicesInGroup,
      );
      mockFirebaseService.sendNotificationsByLocalCode.mockResolvedValue(
        undefined,
      );

      expect(
        await service.handlePushNotiForMachineReport(
          ctx,
          groupId,
          machineId,
          mockGroupContext,
          mockMachineReport,
        ),
      ).toEqual(undefined);
    });
  });

  describe('Get list machine report for webapp', () => {
    const machineId = 'machineIdHTZ1EZY9T89DTDF6Q';
    const query = new GetMachineReportsForWebappQuery();
    query.limit = 1;
    query.page = 1;
    const mockParam: GroupMachineParam = { groupId, machineId };

    const returnValues = {
      data: [
        {
          reportActions: 'Self repair, Repair request (agency/manufacturer)',
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
          lastMachineReportResponse: {
            machineReportResponseId: '01HTHE8AHZ1FSS4RCNS09DY6PJ',
            reportComment: 'report comment duong test',
            commentedAt: '2024-04-03T00:37:25.000Z',
            userId: '01HNW118FMZ8J7DC268ZPKP81A',
            status: 'RESOLVED',
            lat: 999.99,
            lng: 999.99,
            machineReportId: '01HTHE5BFFCW1MMX58BCF21GDC',
            locationAccuracy: 'locationAccuracy',
            devicePlatform: 'IOS',
            reportActions: [],
          },
        },
      ],
      meta: {
        pageInfo: {
          total: 1,
          page: 1,
          limit: 1,
          nextPage: false,
        },
      },
    };
    it('should return list of machine report webapp', async () => {
      mockMachineReportRepository.getListMachineReportForWebapp.mockResolvedValue(
        returnValues.data,
      );

      mockMachineReportRepository.countMachineReportForWebapp.mockResolvedValue(
        1,
      );

      mockMachineReportRepository.getReportActionChoiceForWebapp.mockResolvedValue(
        returnValues.data,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue({
          ...returnValues.data,
          reportActions: [
            'Self repair',
            'Repair request (agency/manufacturer)',
          ],
        }),
      });

      const machineReports = await service.getListMachineReportForWebapp(
        ctx,
        mockParam,
        query,
      );

      expect(machineReports.data).toEqual({
        ...returnValues.data,
        reportActions: ['Self repair', 'Repair request (agency/manufacturer)'],
      });
      expect(machineReports.meta).toEqual(returnValues.meta);
    });

    it('should throw error when machineReportService fail', async () => {
      mockMachineReportRepository.getListMachineReportForWebapp.mockResolvedValue(
        returnValues.data,
      );

      mockMachineReportRepository.countMachineReportForWebapp.mockRejectedValue(
        {
          message: 'Test error',
        },
      );

      try {
        await service.getListMachineReportForWebapp(ctx, mockParam, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
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

    it('should create machine operation report success', async () => {
      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineReportRepo = mockDataSource.getRepository(MachineReport);
      const machineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const machineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const machineOperationReportRepo = mockDataSource.getRepository(
        MachineOperationReport,
      );

      jest
        .spyOn(mockFirebaseService, 'createNotifications')
        .mockReturnValue({});

      await service.createMachineOperationReport(ctx, params, input);

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineReportRepo.insert).toHaveBeenCalled();
      expect(machineReportResponseRepo.insert).toHaveBeenCalled();
      expect(machineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(machineOperationReportRepo.insert).toHaveBeenCalled();
    });
  });

  describe('createFuelMaintenanceReport', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PRQWE',
    };
    const input: FuelMaintenanceReportInput = {
      serviceMeterInHour: 1,
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
      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineReportRepo = mockDataSource.getRepository(MachineReport);
      const machineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const fuelRefillRepo = mockDataSource.getRepository(FuelRefill);

      const fuelMaintenanceReportRepo = mockDataSource.getRepository(
        FuelMaintenanceReport,
      );
      const machineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);

      jest
        .spyOn(mockFirebaseService, 'createNotifications')
        .mockReturnValue({});

      await service.createFuelMaintenanceReport(input, params, ctx);

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineReportRepo.insert).toHaveBeenCalled();
      expect(machineReportResponseRepo.insert).toHaveBeenCalled();
      expect(fuelRefillRepo.insert).toHaveBeenCalled();
      expect(fuelMaintenanceReportRepo.insert).toHaveBeenCalled();
      expect(machineReportHistoryRepo.insert).toHaveBeenCalled();
    });
  });

  describe('Get report filter count', () => {
    const machineId = 'machineIdHTZ1EZY9T89DTDF6Q';
    const query = new GetReportFilterCountQuery();
    query.startDate = dayjs().toDate();
    query.utc = '+00:00';
    const mockParam: GroupMachineParam = { groupId, machineId };
    (convertTimezoneToUTC as jest.Mock).mockReturnValue(
      dayjs(query.startDate).format(),
    );
    const query2 = new GetReportFilterCountQuery();
    const responseData = {
      data: {
        inspectionReportCount: 11,
        fuelMaintenanceReportCount: 1,
        incidentReportCount: 2,
        machineOperationReportCount: 1,
        totalFuelRefueled: null,
      },
      meta: {},
    };
    it('should return report filter count', async () => {
      mockMachineReportRepository.countReportSummary.mockResolvedValue([
        {
          subType: MachineSummaryType.INSPECTION,
          count: 1,
        },
        {
          subType: MachineSummaryType.INCIDENT_REPORTS,
          count: 2,
        },
        {
          subType: MachineSummaryType.MAINTENANCE_REPORTS,
          count: 1,
        },
      ]);

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(responseData),
      });

      const response = await service.getReportFilterCount(
        ctx,
        mockParam,
        query,
        group,
      );

      expect(response).toEqual(responseData);
    });

    it('should return report filter count when not filter startDate', async () => {
      (convertTimezoneToUTC as jest.Mock).mockReturnValue(dayjs().format());
      mockMachineReportRepository.countReportSummary.mockResolvedValue([
        {
          subType: MachineSummaryType.INSPECTION,
          count: 1,
        },
        {
          subType: MachineSummaryType.INCIDENT_REPORTS,
          count: 2,
        },
        {
          subType: MachineSummaryType.MAINTENANCE_REPORTS,
          count: 1,
        },
      ]);

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(responseData),
      });

      const response = await service.getReportFilterCount(
        ctx,
        mockParam,
        query2,
        group,
      );

      expect(response).toEqual(responseData);
    });
    it('should throw error when machineReportService fail', async () => {
      mockMachineReportRepository.countReportSummary.mockResolvedValue([
        {
          subType: MachineSummaryType.INSPECTION,
          count: 1,
        },
        {
          subType: MachineSummaryType.INCIDENT_REPORTS,
          count: 2,
        },
        {
          subType: MachineSummaryType.MAINTENANCE_REPORTS,
          count: 1,
        },
      ]);

      try {
        await service.getReportFilterCount(ctx, mockParam, query, group);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });
  });

  describe('getMachineOperationReportDetail', () => {
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('should return error when machineReportRepository find fail', async () => {
      mockMachineReportRepository.getMachineOperationReportDetail.mockRejectedValue(
        new Error(),
      );

      try {
        await service.getMachineOperationReportDetail(ctx, mockParams);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return machine operation report detail success', async () => {
      const mockOutput = {
        machineReportId: '01J0TC952NPJ1RKMSKDVW27C88',
        reportTitle: 'reportTitle',
        lastStatusUpdatedAt: '2024-06-20T08:30:16.000Z',
        firstMachineReportResponseId: '01J0TC952NBQJ7N3DFZ1KYWXYW',
        lastMachineReportResponseId: '01J0TC952NBQJ7N3DFZ1KYWXYW',
        currentStatus: 'POSTED',
        inspectionResultId: null,
        machineId: '01HNMBYQGMSDZ84VEM663VAGHX',
        firstMachineReportResponse: {
          machineReportResponseId: '01J0TC952NBQJ7N3DFZ1KYWXYW',
          reportComment: 'ab 123123213',
          commentedAt: '2024-06-20T08:30:16.000Z',
          userId: '01HTXVNMAGM2NVABX7HJ19KEAY',
          status: 'UNADDRESSED',
          lat: null,
          lng: null,
          machineReportId: '01J0TC952NPJ1RKMSKDVW27C88',
          locationAccuracy: null,
          devicePlatform: null,
          subtype: 'MACHINE_OPERATION_REPORTS',
          serviceMeterInHour: 0,
          user: {
            userId: '01HTXVNMAGM2NVABX7HJ19KEAY',
            searchId: '892455094',
            givenName: 'abc',
            surname: 'sur',
            pictureUrl: '',
            email: 'dat.bui2@monstar-lab.com',
            isSearchableByEmail: true,
            registeredAt: '2024-04-08T03:22:46.000Z',
            isoLocaleCode: 'ar',
            residenceCountryCode: 'BR',
            dateOfBirth: '2016',
            currentStatus: 'UPDATED',
            lastStatusUpdatedAt: '2024-04-15T07:18:39.000Z',
          },
          machineOperationReport: {
            machineReportResponseId: '01J0TC952NBQJ7N3DFZ1KYWXYW',
            startAt: '2024-06-24T20:10:25.730Z',
            endAt: '2024-06-24T20:10:25.730Z',
            operationDetail: 'test',
            comment: 'test',
          },
        },
      };

      mockMachineReportRepository.getMachineOperationReportDetail.mockResolvedValue(
        mockOutput,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockOutput),
      });

      const result = await service.getMachineOperationReportDetail(
        ctx,
        mockParams,
      );

      expect(result).toEqual(mockOutput);
    });
  });

  describe('Get machine summary', () => {
    const machineId = 'machineIdHTZ1EZY9T89DTDF6Q';
    const query = new GetMachineSummaryQuery();
    query.limit = 10;
    query.page = 1;
    query.startDate = dayjs().toDate();
    query.utc = '+00:00';
    const mockParam: GroupMachineParam = { groupId, machineId };
    (convertTimezoneToUTC as jest.Mock).mockReturnValue(
      dayjs(query.startDate).format(),
    );
    const query2 = new GetMachineSummaryQuery();
    query2.limit = 10;
    query2.page = 1;
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
          total: 0,
          page: 1,
          limit: 10,
          nextPage: false,
        },
      },
    };

    it('should return list machine summary', async () => {
      mockMachineReportRepository.getListMachineSummary.mockResolvedValue(
        returnValues.data,
      );

      mockMachineReportRepository.countReportSummary.mockResolvedValue([
        { machineSummaryCount: 1 },
      ]);

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues.data),
      });

      const machineReports = await service.getMachineSummary(
        ctx,
        mockParam,
        query,
      );

      expect(machineReports.data).toEqual(returnValues.data);
      expect(machineReports.meta).toEqual(returnValues.meta);
    });

    it('should return list machine summary when not have filter startDate', async () => {
      (convertTimezoneToUTC as jest.Mock).mockReturnValue(dayjs().format());
      mockMachineReportRepository.getListMachineSummary.mockResolvedValue(
        returnValues.data,
      );

      mockMachineReportRepository.countReportSummary.mockResolvedValue([
        { machineSummaryCount: 1 },
      ]);

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues.data),
      });

      const machineReports = await service.getMachineSummary(
        ctx,
        mockParam,
        query2,
      );

      expect(machineReports.data).toEqual(returnValues.data);
      expect(machineReports.meta).toEqual(returnValues.meta);
    });

    it('should throw error when machineReportService fail', async () => {
      mockMachineReportRepository.getListMachineSummary.mockResolvedValue(
        new Error(),
      );

      try {
        await service.getMachineSummary(ctx, mockParam, query);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getFuelMaintenanceReportDetail', () => {
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('getFuelMaintenanceReportDetail fail', async () => {
      mockMachineReportRepository.getFuelMaintenanceReportDetail.mockRejectedValue(
        new Error(),
      );

      try {
        await service.getFuelMaintenanceReportDetail(ctx, mockParams);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return machine operation report detail success', async () => {
      const mockOutput = {
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

      mockMachineReportRepository.getFuelMaintenanceReportDetail.mockResolvedValue(
        mockOutput,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockOutput),
      });

      const result = await service.getMachineOperationReportDetail(
        ctx,
        mockParams,
      );

      expect(result).toEqual(mockOutput);
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

    it('Should create fuel maintenance report successfully', async () => {
      mockedIMICRepository.find.mockResolvedValue([]);
      mockedMRCRepository.findOne.mockResolvedValue([
        {
          maintenanceReasonChoiceId: '01J1VXN50PQV3WVP84FRPXYR5R',
          maintenanceReasonChoiceCode: 'PERIOD_ELAPSE',
        },
      ]);
      mockedMRPCRepository.findOne.mockResolvedValue([]);
      mockedRMICRepository.findOne.mockResolvedValue([
        {
          regularMaintenanceItemChoiceId: '01J1VTCXBG083S10XJCKHV2E9W',
          regularMaintenanceItemChoiceCode: '500HOURS',
          position: 1,
          isDisabled: false,
        },
      ]);

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineReportRepo = mockDataSource.getRepository(MachineReport);
      const machineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const machineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);

      jest
        .spyOn(mockFirebaseService, 'createNotifications')
        .mockReturnValue({});

      await service.createMaintenanceReport(input, params, ctx, group);

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineReportRepo.insert).toHaveBeenCalled();
      expect(machineReportResponseRepo.insert).toHaveBeenCalled();
      expect(machineReportHistoryRepo.insert).toHaveBeenCalled();
    });
  });

  describe('getMaintenanceReportDetail', () => {
    const mockParams: GroupMachineReportParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
      machineReportId: 'machineReport01HD0E2GAANRQ80',
    };

    it('getMaintenanceReportDetail fail', async () => {
      mockMachineReportRepository.getMaintenanceReportDetail.mockRejectedValue(
        new Error(),
      );

      try {
        await service.getMaintenanceReportDetail(ctx, mockParams);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return maintenance report detail success', async () => {
      const mockDataRepo = {
        machineReportId: '01J1YHWJVDN977ANAYVQ8HQBWH',
        reportTitle: '',
        lastStatusUpdatedAt: ' 2024-07-04T09:40:55.000Z',
        firstMachineReportResponseId: '01J1YHWJVEQ56ZMQS2FXHB56F5',
        lastMachineReportResponseId: '01J1YHWJVEQ56ZMQS2FXHB56F5',
        currentStatus: 'POSTED',
        inspectionResultId: null,
        machineId: '01HNMBYQGMSDZ84VEM663VAGHX',
        firstMachineReportResponse: {
          machineReportResponseId: '01J1YHWJVEQ56ZMQS2FXHB56F5',
          reportComment: null,
          commentedAt: '2024-07-04T09:40:55.000Z',
          userId: '01HTXVNMAGM2NVABX7HJ19KEAY',
          status: null,
          lat: 16.0805,
          lng: 108.23847,
          machineReportId: '01J1YHWJVDN977ANAYVQ8HQBWH',
          locationAccuracy: 'location',
          devicePlatform: 'IOS',
          subtype: 'MAINTENANCE_REPORTS',
          serviceMeterInHour: null,
          user: {
            userId: '01HTXVNMAGM2NVABX7HJ19KEAY',
            searchId: '892455094',
            givenName: 'abc',
            surname: 'sur',
            pictureUrl: '',
            email: 'dat.bui2@monstar-lab.com',
            isSearchableByEmail: true,
            registeredAt: '2024-04-08T03:22:46.000Z',
            isoLocaleCode: 'en',
            residenceCountryCode: 'BR',
            dateOfBirth: '2016',
            currentStatus: 'UPDATED',
            lastStatusUpdatedAt: '2024-07-02T09:44:37.000Z',
          },
          maintenanceReport: {
            machineReportResponseId: '01J1YHWJVEQ56ZMQS2FXHB56F5',
            comment: 'comment',
            serviceMeterInHour: 12.4,
            workAt: '2024-07-04T19:48:25.210Z',
            regularMaintenanceItemChoiceId: '01J1VV8HG9XVG3R1EYPRKYBHCX',
            maintenanceReasonChoiceId: '01J1VXMZTKE987Y011207JWDCX',
            maintenanceReasonPeriodChoiceId: '01J1VX80SFP41TWFG40H61Q97T',
            regularMaintenanceItemChoice: {
              regularMaintenanceItemChoiceTranslation: {
                regularMaintenanceItemChoiceName: 'name',
              },
            },
            maintenanceReasonChoice: {},
            maintenanceReasonPeriodChoice: {},
            maintenanceReportIrregularMaintenanceItems: [],
          },
          machineReportMedias: [],
        },
      };
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
        machineReportMedias: [],
        comment: 'comment',
      };

      mockMachineReportRepository.getMaintenanceReportDetail.mockResolvedValue(
        mockDataRepo,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockGetMaintenanceReportDetailOutput),
      });

      const result = await service.getMaintenanceReportDetail(ctx, mockParams);

      expect(result).toEqual(mockGetMaintenanceReportDetailOutput);
    });
  });
});
