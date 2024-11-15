import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { FirebaseService } from '@firebase/services/firebase.service';
import { createMock } from '@golevelup/ts-jest';
import { GroupMachineParam } from '@group/dtos';
import { Group } from '@group/entities';
import { GroupRepository } from '@group/repositories';
import {
  CreateInspectionFormInput,
  CreateInspectionInput,
  GetInspectionQuery,
  GroupMachineInspectionFormParam,
  GroupMachineInspectionItemTemplateParam,
  GroupMachineInspectionParam,
  InspectionFormParam,
  InspectionParam,
  PaginationInputQuery,
  SyncInspectionDataInput,
  SyncInspectionResultInput,
  UpdateInspectionFormInput,
  UpdateInspectionInput,
} from '@inspection/dtos';
import {
  CustomInspectionForm,
  CustomInspectionFormHistory,
  CustomInspectionItem,
  CustomInspectionItemHistory,
  CustomInspectionItemMedia,
  Inspection,
  InspectionHistory,
  InspectionResult,
  InspectionResultHistory,
} from '@inspection/entities';
import {
  CustomInspectionFormRepository,
  CustomInspectionItemRepository,
  InspectionFormTemplateRepository,
  InspectionFormTemplateTranslationRepository,
  InspectionRepository,
} from '@inspection/repositories';
import { Machine } from '@machine/entities';
import { MachineRepository } from '@machine/repositories';
import {
  MachineReport,
  MachineReportHistory,
  MachineReportMedia,
  MachineReportResponse,
} from '@machine-report/entities';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CustomInspectionFormCurrentStatus,
  CustomInspectionItemResultType,
  DevicePlatform,
  InspectionCurrentStatus,
  InspectionFormType,
  ISOLocaleCode,
  ItemCodeType,
  StatusName,
} from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';
import * as classTransformerModule from 'class-transformer';
import * as fs from 'fs';
import { I18nService } from 'nestjs-i18n';
import puppeteer from 'puppeteer';
import { DataSource } from 'typeorm';

import { InspectionService } from './inspection.service';

describe('InspectionService', () => {
  let service: InspectionService;
  let dataSource: DataSource;
  jest.mock('puppeteer');

  const mockedCustomInspectionFormRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    getInspectionFormsInGroup: jest.fn(),
    getInspectionItems: jest.fn(),
    getInspectionForm: jest.fn(),
    getCustomInspectionForm: jest.fn(),
    insert: jest.fn(),
  };

  const mockedInspectionFormTemplateTranslationRepository = {
    getInspectionFormTemplateByMachineTypeId: jest.fn(),
  };

  const mockedInspectionFormTemplateRepository = {
    getInspectionItemTemplates: jest.fn(),
    getInspectionFormTemplateWithResultType: jest.fn(),
  };
  const mockedInspectionRepository = {
    getListUserInspectionDraft: jest.fn(),
    getListInspection: jest.fn(),
    getInspectionDetail: jest.fn(),
    getInspectionsForWebapp: jest.fn(),
    findOne: jest.fn(),
  };

  const mockBlobStorageService = {
    generateSasUrl: jest.fn(),
    generateThumbnailPath: jest.fn(),
  };

  const mockI18n = { t: jest.fn() };

  const mockedGroupRepository = {
    getGroupRelationships: jest.fn(),
  };

  const mockedFirebaseService = {
    sendNotificationsByLocalCode: jest.fn(),
  };

  const mockedUserRepository = {
    getUserDevicesInGroup: jest.fn(),
    getUserByCiam: jest.fn(),
  };

  const mockedCustomInspectionItemRepository = {
    find: jest.fn(),
    insert: jest.fn(),
  };

  const mockedUserGroupAssignmentRepository = {
    checkPermissionInGroupSyncData: jest.fn(),
  };

  const mockedMachineRepository = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockUserCiamLinkRepository = {
    userCiamLinkRepository: jest.fn(),
  };
  const mockedConfigService = { get: jest.fn() } as unknown as ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InspectionService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: CustomInspectionFormRepository,
          useValue: mockedCustomInspectionFormRepository,
        },
        {
          provide: DataSource,
          useValue: createMock<DataSource>(),
        },
        {
          provide: InspectionFormTemplateTranslationRepository,
          useValue: mockedInspectionFormTemplateTranslationRepository,
        },
        {
          provide: InspectionFormTemplateRepository,
          useValue: mockedInspectionFormTemplateRepository,
        },
        {
          provide: InspectionRepository,
          useValue: mockedInspectionRepository,
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
          provide: BlobStorageService,
          useValue: mockBlobStorageService,
        },
        {
          provide: GroupRepository,
          useValue: mockedGroupRepository,
        },
        {
          provide: FirebaseService,
          useValue: mockedFirebaseService,
        },
        {
          provide: UserRepository,
          useValue: mockedUserRepository,
        },
        {
          provide: CustomInspectionItemRepository,
          useValue: mockedCustomInspectionItemRepository,
        },
        {
          provide: UserGroupAssignmentRepository,
          useValue: mockedUserGroupAssignmentRepository,
        },
        {
          provide: MachineRepository,
          useValue: mockedMachineRepository,
        },
        {
          provide: UserCiamLinkRepository,
          useValue: mockUserCiamLinkRepository,
        },
      ],
    }).compile();

    service = module.get<InspectionService>(InspectionService);
    dataSource = module.get<DataSource>(DataSource);
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const machineId = 'machineIdN9Q0KYA36EJ6PR7W7';
  const customInspectionFormId = 'inspectionFormId6EJ6PR7W7R';
  const inspectionFormTemplateId = 'inspectionFormTpIdJ6PR7W7R';
  const inspectionId = 'inspectionFormTpIdJ6PR7W7R';
  const params: GroupMachineParam = {
    machineId,
    groupId,
  };
  const paramsInspectionTemplate: GroupMachineInspectionItemTemplateParam = {
    inspectionFormTemplateId,
    machineId,
    groupId,
  };
  const paramsInspectionForm: GroupMachineInspectionFormParam = {
    customInspectionFormId,
    machineId,
    groupId,
  };
  const paramsInspection: InspectionParam = {
    inspectionId,
    machineId,
    groupId,
  };

  const machineTypeId = 'machineTypeD3DE0SAVCGDC8DMP74E';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;
  const group = new Group();
  group.machines = [new Machine()];
  group.machines[0].inspections = [new Inspection()];
  group.machines[0].machineTypeId = machineTypeId;
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteInspectionForm', () => {
    const params: InspectionFormParam = {
      groupId,
      machineId: machineId,
      customInspectionFormId: 'inspectionFromN9Q036EJ6PRDW',
    };

    it('delete inspection form success', async () => {
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const mockInspectionItems = [
        {
          customInspectionItemId: '01HQQH2TJ1BE4X2HXNTV32F4N0',
          customInspectionFormId: '01HQQH2THGYYDJGST58WBQCFZD',
          name: '車体周りの外観チェック',
          description: '車体部品の損傷、変形、亀裂、ゆるみ、脱落の有無',
          resultType: 'OK_OR_ANOMARY',
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 1,
          currentStatus: 'DELETED',
          lastStatusUpdatedAt: new Date(),
          itemCode: null,
        },
      ];

      mockedCustomInspectionFormRepository.insert.mockReturnThis();
      mockedCustomInspectionItemRepository.find.mockReturnValue(
        mockInspectionItems,
      );
      mockedCustomInspectionItemRepository.insert.mockReturnThis();

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const customInspectionFormRepo =
        mockDataSource.getRepository(CustomInspectionForm);
      mockDataSource.getRepository(CustomInspectionItem);

      await service.deleteInspectionForm(ctx, params);

      expect(spyTransaction).toHaveBeenCalled();
      expect(customInspectionFormRepo.update).toHaveBeenCalled();
    });

    it('MachineTypeRepository find error', async () => {
      mockedCustomInspectionFormRepository.findOne.mockReturnValue(null);

      try {
        await service.deleteInspectionForm(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Inspection form not found.');
      }
    });
  });

  describe('getListInspectionForm', () => {
    it('get list inspection form success', async () => {
      const mockCustomInspectionForm = [
        {
          customInspectionFormId: 'customInspectionQA36EJ6PW7',
          name: 'customInspection',
        },
      ];

      mockedCustomInspectionFormRepository.find.mockResolvedValue(
        mockCustomInspectionForm,
      );

      expect(await service.getListInspectionForm(ctx, params)).toEqual(
        mockCustomInspectionForm,
      );
    });

    it('MachineTypeRepository find error', async () => {
      mockedCustomInspectionFormRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListInspectionForm(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getListUserInspectionDraft', () => {
    it('get list user inspection draft success', async () => {
      const mockInspection = [
        {
          inspectionId: 'inspectionQA36EJ6PW7123456',
          name: 'inspection',
          lastStatusUpdatedAt: new Date(),
        },
      ];

      mockedInspectionRepository.getListUserInspectionDraft.mockResolvedValue(
        mockInspection,
      );

      expect(await service.getListUserInspectionDraft(ctx, params)).toEqual(
        mockInspection,
      );
    });

    it('InspectionRepository error', async () => {
      mockedInspectionRepository.getListUserInspectionDraft.mockRejectedValue(
        new Error(),
      );
      try {
        await service.getListUserInspectionDraft(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getListInspection', () => {
    const query = new PaginationInputQuery();
    it('get list user inspection posted success', async () => {
      query.limit = 1;
      query.firstRequestTime = new Date();
      const mockInspectionPosted = [
        {
          inspectionId: 'inspectionQA36EJ6PW7123456',
          name: 'inspection',
          lastStatusUpdatedAt: new Date(),
          inspectionReportCount: 1,
        },
      ];
      const mockResponse = {
        meta: {
          pageInfo: {
            nextPage: false,
            limit: query.limit,
            page: 1,
            firstRequestTime: query.firstRequestTime,
          },
        },
        data: mockInspectionPosted,
      };
      mockedInspectionRepository.getListInspection.mockResolvedValue(
        mockInspectionPosted,
      );
      const responses = await service.getListInspection(ctx, params, query);
      expect(responses.meta).toEqual(mockResponse.meta);
      expect(responses.data).toEqual(mockResponse.data);
    });

    it('InspectionRepository error', async () => {
      mockedInspectionRepository.getListInspection.mockRejectedValue(
        new Error(),
      );
      try {
        await service.getListInspection(ctx, params, query);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getListUserInspectionFormDraft', () => {
    it('get list inspection form draft success', async () => {
      const mockCustomInspectionForm = [
        {
          customInspectionFormId: 'customInspectionQA36EJ6PW7',
          name: 'customInspection',
          lastStatusUpdatedAt: new Date(),
        },
      ];

      mockedCustomInspectionFormRepository.find.mockResolvedValue(
        mockCustomInspectionForm,
      );

      expect(await service.getListUserInspectionFormDraft(ctx, params)).toEqual(
        mockCustomInspectionForm,
      );
    });

    it('MachineTypeRepository find error', async () => {
      mockedCustomInspectionFormRepository.find.mockRejectedValue(new Error());
      try {
        await service.getListUserInspectionFormDraft(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getListTemplateAndCreatedInspectionForm', () => {
    it('get list template, created inspection form success', async () => {
      const mockInspectionFormTemplateTranslationRepository = [
        {
          inspectionFormTemplateId: 'templateInspectionQA36EJ6PW7',
          inspectionFormTemplateName: 'templateInspectionName',
        },
      ];

      const mockCustomInspectionForm = [
        {
          customInspectionFormId: 'customInspectionQA36EJ6PW7',
          name: 'customInspectionName',
        },
      ];

      mockedInspectionFormTemplateTranslationRepository.getInspectionFormTemplateByMachineTypeId.mockResolvedValue(
        mockInspectionFormTemplateTranslationRepository,
      );

      mockedCustomInspectionFormRepository.getInspectionFormsInGroup.mockResolvedValue(
        mockCustomInspectionForm,
      );

      expect(
        await service.getListTemplateAndCreatedInspectionForm(
          ctx,
          params,
          group.machines[0].machineTypeId,
        ),
      ).toEqual({
        inspectionFormTemplates:
          mockInspectionFormTemplateTranslationRepository,
        customInspectionForms: mockCustomInspectionForm,
      });
    });
    it('getInspectionFormTemplateByMachineTypeId error', async () => {
      mockedInspectionFormTemplateTranslationRepository.getInspectionFormTemplateByMachineTypeId.mockResolvedValue(
        new Error(),
      );
      try {
        await service.getListTemplateAndCreatedInspectionForm(
          ctx,
          params,
          group.machines[0].machineTypeId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
    it('getInspectionFormsInGroup error', async () => {
      mockedCustomInspectionFormRepository.getInspectionFormsInGroup.mockResolvedValue(
        new Error(),
      );
      try {
        await service.getListTemplateAndCreatedInspectionForm(
          ctx,
          params,
          group.machines[0].machineTypeId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('createInspectionForm', () => {
    const params: GroupMachineParam = {
      machineId,
      groupId,
    };

    it('createInspectionForm: inspectionFormId is invalid', async () => {
      const body: CreateInspectionFormInput = {
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'name',
        currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
        customInspectionItems: [
          {
            inspectionItemId: undefined,
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
          {
            inspectionItemId: undefined,
            name: 'Odometer (km)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
        ],
      };
      mockedCustomInspectionFormRepository.findOne.mockReturnValue({});
      try {
        await service.createInspectionForm(ctx, params, body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('The inspectionFormId is invalid.');
      }
    });

    it('createInspectionForm: inspectionFormId is invalid', async () => {
      const body: CreateInspectionFormInput = {
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        inspectionFormType: InspectionFormType.TEMPLATE,
        name: 'name',
        currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
        customInspectionItems: [
          {
            inspectionItemId: undefined,
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
          {
            inspectionItemId: undefined,
            name: 'Odometer (km)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
        ],
      };
      mockedInspectionFormTemplateRepository.getInspectionFormTemplateWithResultType.mockReturnValue(
        {},
      );
      try {
        await service.createInspectionForm(ctx, params, body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('The inspectionFormId is invalid.');
      }
    });

    it('should return create publish inspection form success', async () => {
      const body: CreateInspectionFormInput = {
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'name',
        currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        customInspectionItems: [
          {
            inspectionItemId: undefined,
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
          {
            inspectionItemId: undefined,
            name: 'Odometer (km)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
        ],
      };
      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;
      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockCustomInspectionFormRepo =
        mockDataSource.getRepository(CustomInspectionForm);
      const mockCustomInspectionFormHistoryRepo = mockDataSource.getRepository(
        CustomInspectionFormHistory,
      );
      const mockCustomInspectionItemRepo =
        mockDataSource.getRepository(CustomInspectionItem);
      const mockCustomInspectionItemHistoryRepo = mockDataSource.getRepository(
        CustomInspectionItemHistory,
      );
      const mockCustomInspectionItemMediaRepo = mockDataSource.getRepository(
        CustomInspectionItemMedia,
      );

      await service.createInspectionForm(ctx, params, body);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockCustomInspectionFormRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionFormHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemMediaRepo.insert).toHaveBeenCalled();
    });

    it('should createInspectionForm: success', async () => {
      const body: CreateInspectionFormInput = {
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'name',
        currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
        customInspectionItems: [
          {
            inspectionItemId: undefined,
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
          {
            inspectionItemId: undefined,
            name: 'Odometer (km)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
        ],
      };
      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;
      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockCustomInspectionFormRepo =
        mockDataSource.getRepository(CustomInspectionForm);
      const mockCustomInspectionFormHistoryRepo = mockDataSource.getRepository(
        CustomInspectionFormHistory,
      );
      const mockCustomInspectionItemRepo =
        mockDataSource.getRepository(CustomInspectionItem);
      const mockCustomInspectionItemHistoryRepo = mockDataSource.getRepository(
        CustomInspectionItemHistory,
      );
      const mockCustomInspectionItemMediaRepo = mockDataSource.getRepository(
        CustomInspectionItemMedia,
      );

      await service.createInspectionForm(ctx, params, body);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockCustomInspectionFormRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionFormHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemMediaRepo.insert).toHaveBeenCalled();
    });
  });

  describe('updateInspectionForm', () => {
    const params = {
      machineId,
      groupId,
      customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
    };

    const customInspectionForm = {
      customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
    } as any;

    it('updateInspectionForm: inspectionFormId is invalid', async () => {
      const body: UpdateInspectionFormInput = {
        name: 'name',
        currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
        customInspectionItems: [
          {
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
          {
            name: 'Odometer (km)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
        ],
      };
      mockedCustomInspectionFormRepository.findOne.mockReturnValue({});
      try {
        await service.updateInspectionForm(
          ctx,
          params,
          body,
          customInspectionForm,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('The inspectionFormId is invalid.');
      }
    });

    it('should updateInspectionForm: success', async () => {
      const body: CreateInspectionFormInput = {
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        inspectionFormType: InspectionFormType.CUSTOM,
        name: 'name',
        currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
        customInspectionItems: [
          {
            inspectionItemId: undefined,
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
          {
            inspectionItemId: undefined,
            name: 'Odometer (km)',
            description: '',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isImmutable: true,
            isRequired: true,
            isForcedRequired: true,
            itemCode: 'item',
            customInspectionItemMedias: [],
          },
        ],
      };
      const mockDataSource = {
        insert: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.DRAFT;
      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockCustomInspectionFormRepo =
        mockDataSource.getRepository(CustomInspectionForm);
      const mockCustomInspectionFormHistoryRepo = mockDataSource.getRepository(
        CustomInspectionFormHistory,
      );
      const mockCustomInspectionItemRepo =
        mockDataSource.getRepository(CustomInspectionItem);
      const mockCustomInspectionItemHistoryRepo = mockDataSource.getRepository(
        CustomInspectionItemHistory,
      );
      const mockCustomInspectionItemMediaRepo = mockDataSource.getRepository(
        CustomInspectionItemMedia,
      );

      await service.updateInspectionForm(
        ctx,
        params,
        body,
        customInspectionForm,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockCustomInspectionItemRepo.find).toHaveBeenCalled();
      expect(mockCustomInspectionItemRepo.delete).toHaveBeenCalled();
      expect(mockCustomInspectionItemHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionFormRepo.update).toHaveBeenCalled();
      expect(mockCustomInspectionFormHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemHistoryRepo.insert).toHaveBeenCalled();
      expect(mockCustomInspectionItemMediaRepo.insert).toHaveBeenCalled();
    });
  });

  describe('getInspectionItemTemplates', () => {
    it('Get list inspection item templates', async () => {
      const mockInspectionFormTemplateRepository = {
        inspectionFormTemplateId: 'IDHK75FPW6960DGWSMP1QQT7RD',
        createdAt: '2021-01-01T17:00:00.000Z',
        inspectionItemTemplates: [
          {
            inspectionItemId: 'IDHK4R9TN6ATSX3EKPX8SAP3CC',
            resultType: 'OK_OR_ANOMARY',
            inspectionFormTemplateId: 'IDHK75FPW6960DGWSMP1QQT7RD',
            isImmutableItem: false,
            isForcedRequiredItem: false,
            position: 1,
            inspectionItemTemplateTranslations: [
              {
                itemName: 'item1',
                itemDescription: 'des',
              },
            ],
          },
        ],
        inspectionFormTemplateTranslations: [
          {
            inspectionFormTemplateId: '01HK75FPW6960DGWSMP1QQT7RD',
            isoLocaleCode: 'en',
            inspectionFormTemplateName: 'Crawler excavator inspection sheet',
          },
        ],
      };
      const mockResponse = {
        inspectionFormId:
          mockInspectionFormTemplateRepository.inspectionFormTemplateId,
        type: InspectionFormType.TEMPLATE,
        name: mockInspectionFormTemplateRepository
          .inspectionFormTemplateTranslations[0].inspectionFormTemplateName,
        inspectionItems:
          mockInspectionFormTemplateRepository.inspectionItemTemplates.map(
            (inspectionItem) => ({
              ...inspectionItem,

              name: inspectionItem.inspectionItemTemplateTranslations[0]
                .itemName,
              description:
                inspectionItem.inspectionItemTemplateTranslations[0]
                  .itemDescription,
              isImmutable: inspectionItem.isImmutableItem,
              isForcedRequired: inspectionItem.isForcedRequiredItem,
            }),
          ),
      };
      mockedInspectionFormTemplateRepository.getInspectionItemTemplates.mockResolvedValue(
        mockInspectionFormTemplateRepository,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse),
      });

      const result = await service.getInspectionItemTemplates(
        ctx,
        paramsInspectionTemplate,
      );

      expect(result).toEqual(mockResponse);
    });
    it('getInspectionItemTemplates error', async () => {
      mockedInspectionFormTemplateRepository.getInspectionItemTemplates.mockResolvedValue(
        new Error(),
      );

      try {
        await service.getInspectionItemTemplates(ctx, paramsInspectionTemplate);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
    it('getInspectionItemTemplates: inspectionFromTemplate not found', async () => {
      mockedInspectionFormTemplateRepository.getInspectionItemTemplates.mockResolvedValue(
        null,
      );

      try {
        await service.getInspectionItemTemplates(ctx, paramsInspectionTemplate);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('InspectionFormTemplate not found.');
      }
    });
  });

  describe('getInspectionItems', () => {
    it('Get list inspection items', async () => {
      const mockGroup = {
        groupId: 'IDHK9611XFNZXP5SJ6VH1W11PV',
        groupName: 'tesst',
        location: null,
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2024-01-04T01:19:54.410Z',
        companyName: '',
        machines: [
          {
            machineId: '01HK9611XFNZXP5SJ6VH1W11PV',
            machineName: 'test',
            machineTypeId: '0661J7JX6W3970X6PDHTA7SX38',
            pictureUrl: 'test',
            machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
            modelAndType: 'test',
            serialNumber: '111',
            serialNumberPlatePictureUrl: '122rf',
            currentStatus: 'CREATED',
            lastStatusUpdatedAt: '2024-01-03T19:52:03.776Z',
            customMachineManufacturerName: null,
            customTypeName: null,
            groupId: 'IDHK9611XFNZXP5SJ6VH1W11PV',
          },
        ],
      };
      const mockCustomInspectionFormRepository = {
        customInspectionFormId: 'IDHK9611XFNZXP5SJ6VH1W11PV',
        name: 'name',
        machineId: 'IDHK9611XFNZXP5SJ6VH1W11PV',
        currentStatus: 'PUBLISHED',
        lastStatusUpdatedAt: '2024-01-04T03:22:40.100Z',
        customInspectionItems: [
          {
            customInspectionItemId: 'IDHK9611XFNZXP5SJ6VH1W11PV',
            customInspectionFormId: 'IDHK9611XFNZXP5SJ6VH1W11PV',
            name: 'item1',
            description: 'test',
            resultType: 'OK_OR_ANOMARY',
            isRequired: false,
            isImmutable: true,
            isForcedRequired: true,
            position: 1,
            currentStatus: 'PUBLISHED',
            lastStatusUpdatedAt: '2024-01-09T19:42:45.866Z',
            customInspectionItemMedias: [
              {
                fileName: 'test',
                mediaUrl: 'url',
                mimeType: 'test',
                createdAt: '2024-01-09T20:20:15.493Z',
              },
            ],
          },
        ],
      };

      const mockResponse = {
        ...mockCustomInspectionFormRepository,
        inspectionFormId: customInspectionFormId,
        type: InspectionFormType.CUSTOM,
        inspectionItems:
          mockCustomInspectionFormRepository.customInspectionItems.map(
            (inspectionItem) => ({
              ...inspectionItem,
              inspectionItemId: inspectionItem.customInspectionItemId,
              inspectionItemMedias:
                inspectionItem.customInspectionItemMedias.map((item) => ({
                  ...item,
                })),
            }),
          ),
      };
      mockedGroupRepository.getGroupRelationships.mockResolvedValue(mockGroup);
      const mockService = {
        checkGroupNotFound: jest.fn(),
        checkMachineNotFound: jest.fn(),
        checkCustomInspectionFormNotFound: jest.fn(),
      };
      mockedCustomInspectionFormRepository.getInspectionItems.mockResolvedValue(
        mockCustomInspectionFormRepository,
      );
      mockService.checkGroupNotFound(mockGroup, ISOLocaleCode.JA, mockI18n);
      mockService.checkGroupNotFound(
        mockGroup.machines[0],
        ISOLocaleCode.JA,
        mockI18n,
      );
      mockService.checkCustomInspectionFormNotFound(
        mockCustomInspectionFormRepository,
        ISOLocaleCode.JA,
        mockI18n,
        HttpStatus.BAD_REQUEST,
      );
      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockResponse.inspectionItems[0].inspectionItemMedias[0].mediaUrl,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse),
      });

      expect(
        await service.getInspectionItems(ctx, paramsInspectionForm),
      ).toEqual(mockResponse);
    });
    it('getInspectionItems error', async () => {
      mockedCustomInspectionFormRepository.getInspectionItems.mockResolvedValue(
        new Error(),
      );

      try {
        await service.getInspectionItems(ctx, paramsInspectionForm);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getInspectionDetail', () => {
    const params: GroupMachineInspectionParam = {
      machineId,
      groupId,
      inspectionId: 'inspectionA3F83JK5KRHA22YSH',
    };
    it('Get inspection detail', async () => {
      const mockInspectionData = {
        inspectionId: '01HMFMCFGA5J3C23CK7B3MA3PJ',
        machineId: '01HKKBZR7ZAV4HPDDR1NHYDNDZ',
        lat: null,
        lng: null,
        locationAccuracy: null,
        devicePlatform: null,
        currentStatus: 'DRAFT',
        customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
        customInspectionForm: {
          customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
          name: 'string',
          machineId: '01HKKBZR7ZAV4HPDDR1NHYDNDZ',
          currentStatus: 'PUBLISHED',
        },
        inspectionResults: [
          {
            inspectionResultId: '01HMFMGZZTAGJ5GFH4T8XP14GZ',
            result: 'ANOMARY',
            inspectionId: '01HMFMCFGA5J3C23CK7B3MA3PJ',
            customInspectionItemId: '01HKY660RJ1NNYGBNFXBDPPHCX',
            currentStatus: 'OK_OR_ANOMARY',
            customInspectionItem: {
              customInspectionItemId: '01HKY660RJJERJ88Y4FMR921BD',
              customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
              name: 'Service meter/SMR (h)',
              description: '',
              resultType: 'NUMERIC',
              isRequired: true,
              isImmutable: true,
              isForcedRequired: true,
              position: 2,
              currentStatus: 'DRAFT',
              customInspectionItemMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'video/bmp',
                  thumbnailUrl: '/machine-reports/12345678-machine_name.png',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
            },
            machineReport: {
              firstMachineReportResponse: {
                machineReportId: 'machineReportId9A1N3W8KKQK',
                reportTitle: 'string',
                reportComment: 'a',
                inspectionResultId: 'inspectionResultIdR1RH7TXT',
                lat: 0,
                lng: 0,
                locationAccuracy: 'string',
                devicePlatform: 'IOS',
                machineReportMedias: [
                  {
                    machineReportMediaId: 'machineReportMediaId29JFSY',
                    machineReportResponseId: 'machineReportResponseIdWAL',
                    fileName: 'machine_name1.png',
                    mediaUrl: '/machine-reports/12345678-machine_name.png',
                    filePath: '/machine-reports/12345678-machine_name.png',
                    mimeType: 'image/bmp',
                    createdAt: '2024-01-31T10:05:54.000Z',
                    thumbnailUrl: '/machine-reports/12345678-machine_name.png',
                  },
                ],
              },
            },
          },
        ],
        inspectionHistories: [
          {
            user: {
              userId,
            },
          },
        ],
      };

      const mockResponse = {
        inspectionFormId: '01HMFMCFGA5J3C23CK7B3MA3PJ',
        type: 'INSPECTION',
        name: 'string',
        currentStatus: 'DRAFT',
        inspectionItems: [
          {
            inspectionItemId: '01HKY660RJJERJ88Y4FMR921BD',
            name: 'Service meter/SMR (h)',
            description: '',
            resultType: 'NUMERIC',
            isImmutable: true,
            isForcedRequired: true,
            inspectionItemMedias: [],
            inspectionResultId: '01HMFMHBT3HCVH8FM8KRDBJ4G2',
            result: '10',
            inspectionId: '01HMFMCFGA5J3C23CK7B3MA3PJ',
            position: 1,
            machineReport: null,
          },
        ],
      };

      mockBlobStorageService.generateThumbnailPath.mockReturnValue(
        '/thumbnails/12345678-machine_name.png',
      );

      mockedInspectionRepository.getInspectionDetail.mockResolvedValue(
        mockInspectionData,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResponse),
      });

      expect(await service.getInspectionDetail(ctx, params)).toEqual(
        mockResponse,
      );
    });
  });

  describe('createInspection', () => {
    it('createInspection: success', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
          {
            inspectionItemId: '01HR6FDMHBXS990XWWEEZE8N5T',
            result: '',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: false,
          },
        ],
      };

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HMZSVHWSEY5J7ZPQBY3G3497',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: 'OK_OR_ANOMARY',
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
        {
          customInspectionItemId: '01HR6FDMHBXS990XWWEEZE8N5T',
          customInspectionFormId: '01HMZSVHWSEY5J7ZPQBY3G3497',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: 'NUMERIC',
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValue(mockCustomInspectionItem);

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      await service.createInspection(ctx, params, input, group);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionRepo.insert).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('createInspection: success noti', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: '1000',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: ItemCodeType.SERVICE_METER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValue(mockCustomInspectionItem);

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      jest.spyOn(service, 'handlePushNotiForInspection').mockImplementation();

      mockedMachineRepository.create.mockReturnThis();
      mockedMachineRepository.update.mockReturnThis();

      const data = await service.createInspection(ctx, params, input, group);

      expect(data).toEqual({
        data: {},
        meta: { successMessage: undefined },
      });
      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionRepo.insert).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('createInspection: InspectionFormId not found.', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(undefined);
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Custom inspection form not found or not in this machine.',
        );
      }
    });

    it('createInspection: inspectionItem not found in inspectionForm', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      const mockCustomInspectionItem = {
        customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
        customInspectionFormId: '01HMZSVHWSEY5J7ZPQBY3G3497',
        name: 'Oil and coolant level of engine/hydraulic system',
        description:
          'Check the oil level of engine, hydraulic components, and coolant system.',
        resultType: 'OK_OR_ANOMARY',
        isRequired: true,
        isImmutable: false,
        isForcedRequired: false,
        position: 3,
        currentStatus: 'PUBLISHED',
        lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
        itemCode: null,
      };
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);

      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'inspectionItem not found in inspectionForm.',
        );
      }
    });

    it('createInspection: InspectionFormId Deleted.', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.DELETED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('createInspection: MachineReport must be not empty when result have value ANOMARY', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: null,
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: 'OK_OR_ANOMARY',
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValue(mockCustomInspectionItem);

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Input machine report when result have value ANOMARY',
        );
      }
    });

    it('createInspection: The machine report response input must have at least one field.', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'The machine report response input must have at least one field.',
        );
      }
    });

    it('createInspection: result must be greater than 1 characters.', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: '',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Result must be greater than 1 characters.',
        );
      }
    });

    it('createInspection: Result must match result type NUMERIC', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            result: 'a',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.ODOMETER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);

      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Result must match result type NUMERIC');
      }
    });

    it('createInspection: isRequired or resultType or itemCode input wrong.', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'a',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'isRequired or resultType or itemCode input wrong.',
        );
      }
    });

    it('createInspection: item code must match result type NUMERIC', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            result: '12',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: null,
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'item code must match result type NUMERIC',
        );
      }
    });

    it('createInspection: Result must match result type OK_OR_ANOMARY', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'a',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Result must match result type OK_OR_ANOMARY',
        );
      }
    });

    it('createInspection: Not input machine report when result OK', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'OK',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      try {
        await service.createInspection(ctx, params, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Not input machine report when result OK',
        );
      }
    });

    it('createInspection: Result value out of range with itemCode SERVICE_METER or ODOMETER', async () => {
      const input: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            result: '0.11',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
          {
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            result: '1000000.0',
            itemCode: ItemCodeType.ODOMETER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };

      try {
        await service.createInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('updateInspection', () => {
    it('updateInspection: success', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
            result: '12',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };
      const dataInspectionItems = [
        {
          inspectionResultId: '01HMQYXD36476QTY0KYBAFRACM',
          result: 'ANOMARY',
          inspectionId: '01HMQW4E0P352RG6GSBVKR7FDP',
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          currentStatus: 'POSTED',
          lastStatusUpdatedAt: '2024-01-22T06:49:49.000Z',
          machineReport: {
            machineReportId: '01HMQYXD36P7H306GPA1B2RGPG',
            reportTitle: 'string',
            lastStatusUpdatedAt: '2024-01-22T06:49:49.000Z',
            firstMachineReportResponseId: '01HMQYXD36SCJ63Y3YYQYRX285',
            lastMachineReportResponseId: '01HMQYXD36SCJ63Y3YYQYRX285',
            currentStatus: 'POSTED',
            inspectionResultId: '01HMQYXD36476QTY0KYBAFRACM',
            machineId: '01HK9611XFNZXP5SJ6VH1W11PV',
            machineReportResponses: [
              {
                machineReportResponseId: 'test',
                machineReportMedias: [
                  {
                    machineReportMediaId: 'string',
                    fileName: 'machine_name.png',
                    mediaUrl: '/machine-reports/12345678-machine_name.png',
                    filePath: '/machine-reports/12345678-machine_name.png',
                    mimeType: 'image/bmp',
                  },
                  {
                    machineReportMediaId: 'string',
                    fileName: 'machine_name1.png',
                    mediaUrl: '/machine-reports/12345678-machine_name.png',
                    filePath: '/machine-reports/12345678-machine_name.png',
                    mimeType: 'image/bmp',
                  },
                ],
              },
            ],
            machineReportHistories: [{ machineReportHistoryId: 'test' }],
          },
        },
      ];
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.ODOMETER,
        },
        {
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Service meter/SMR (h)',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: true,
          isForcedRequired: true,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      const mockDataSource = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
        find: jest.fn(),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      mockInspectionResultRepo.find.mockResolvedValue(dataInspectionItems);

      await service.updateInspection(ctx, paramsInspection, input, group);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.delete).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.delete).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.delete).toHaveBeenCalled();
      expect(mockMachineReportRepo.delete).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.delete).toHaveBeenCalled();
      expect(mockInspectionResultRepo.delete).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionRepo.update).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('updateInspection: success with no machine report', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
            result: '12',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };
      const dataInspectionItems = [
        {
          inspectionResultId: '01HMQYXD36476QTY0KYBAFRACM',
          result: 'ANOMARY',
          inspectionId: '01HMQW4E0P352RG6GSBVKR7FDP',
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          currentStatus: 'POSTED',
          lastStatusUpdatedAt: '2024-01-22T06:49:49.000Z',
        },
      ];
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.ODOMETER,
        },
        {
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Service meter/SMR (h)',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: true,
          isForcedRequired: true,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      const mockDataSource = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
        find: jest.fn(),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      mockInspectionResultRepo.find().mockReturnValue(dataInspectionItems);

      await service.updateInspection(ctx, paramsInspection, input, group);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.delete).toHaveBeenCalled();
      expect(mockInspectionResultRepo.delete).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionRepo.update).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('updateInspection: success and push noti', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
            result: '12',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };
      const dataInspectionItems = [
        {
          inspectionResultId: '01HMQYXD36476QTY0KYBAFRACM',
          result: 'ANOMARY',
          inspectionId: '01HM3FDV8CCCC34FZS397VGQCH',
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          currentStatus: 'POSTED',
          lastStatusUpdatedAt: '2024-01-22T06:49:49.000Z',
          machineReport: {
            machineReportId: '01HMQYXD36P7H306GPA1B2RGPG',
            reportTitle: 'string',
            lastStatusUpdatedAt: '2024-01-22T06:49:49.000Z',
            firstMachineReportResponseId: '01HMQYXD36SCJ63Y3YYQYRX285',
            lastMachineReportResponseId: '01HMQYXD36SCJ63Y3YYQYRX285',
            currentStatus: 'POSTED',
            inspectionResultId: '01HMQYXD36476QTY0KYBAFRACM',
            machineId: '01HK9611XFNZXP5SJ6VH1W11PV',
            machineReportResponses: [Array],
          },
        },
        {
          inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
          inspectionId: '01HM3FDV8CCCC34FZS397VGQCH',
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          result: '12',
          itemCode: ItemCodeType.SERVICE_METER,
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          currentStatus: 'POSTED',
          lastStatusUpdatedAt: '2024-01-22T06:49:49.000Z',
        },
      ];

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.ODOMETER,
        },
        {
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Service meter/SMR (h)',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: true,
          isForcedRequired: true,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      const mockDataSource = {
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      mockInspectionResultRepo.find().mockReturnValue(dataInspectionItems);
      mockedCustomInspectionFormRepository.findOne();
      jest.spyOn(service, 'handlePushNotiForInspection').mockImplementation();

      const data = await service.updateInspection(
        ctx,
        paramsInspection,
        input,
        group,
      );

      expect(data).toEqual({
        data: {},
        meta: { successMessage: undefined },
      });
      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionResultRepo.delete).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionRepo.update).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('updateInspection: inspectionItem not found in inspectionForm', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      const mockCustomInspectionItem = {
        customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
        customInspectionFormId: '01HMZSVHWSEY5J7ZPQBY3G3497',
        name: 'Oil and coolant level of engine/hydraulic system',
        description:
          'Check the oil level of engine, hydraulic components, and coolant system.',
        resultType: 'OK_OR_ANOMARY',
        isRequired: true,
        isImmutable: false,
        isForcedRequired: false,
        position: 3,
        currentStatus: 'PUBLISHED',
        lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
        itemCode: null,
      };
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'inspectionItem not found in inspectionForm.',
        );
      }
    });

    it('updateInspection: MachineReport must be not empty when result have value ANOMARY', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999,
            },
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Input machine report when result have value ANOMARY',
        );
      }
    });

    it('updateInspection: The machine report response input must have at least one field.', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 19.9,
            },
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'The machine report response input must have at least one field.',
        );
      }
    });

    it('updateInspection: result must be greater than 1 characters.', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: '',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Result must be greater than 1 characters.',
        );
      }
    });

    it('updateInspection: Result must match result type NUMERIC', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.ODOMETER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Result must match result type NUMERIC');
      }
    });

    it('updateInspection: inspectionItem input not valid.', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.ODOMETER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('inspectionItem input not valid.');
      }
    });

    it('updateInspection: isRequired or resultType or itemCode input wrong.', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'isRequired or resultType or itemCode input wrong.',
        );
      }
    });

    it('updateInspection: item code must match result type NUMERIC', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            result: '12',
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
            itemCode: null,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'item code must match result type NUMERIC',
        );
      }
    });

    it('updateInspection: Result must match result type OK_OR_ANOMARY', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'test',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Result must match result type OK_OR_ANOMARY',
        );
      }
    });

    it('updateInspection: Not input machine report when result OK', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            result: 'OK',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            itemCode: ItemCodeType.ODOMETER,
            machineReport: {
              reportComment: '',
              machineReportMedias: [
                {
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Not input machine report when result OK',
        );
      }
    });

    it('updateInspection: Result value out of range with itemCode SERVICE_METER or ODOMETER', async () => {
      const input: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 999,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        inspectionItems: [
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            result: '0.11',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            result: '1000000.0',
            itemCode: ItemCodeType.ODOMETER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };

      try {
        await service.updateInspection(ctx, paramsInspection, input, group);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('handlePushNotiForInspection', () => {
    it('handlePushNotiForInspection not push notification', async () => {
      const customInspectionForm = new CustomInspectionForm();
      mockedUserRepository.getUserDevicesInGroup.mockResolvedValue([]);

      const inspectionItems = {
        machineReportIds: [],
        machineReportResponseIds: [],
        inspectionId: '',
      };
      expect(
        await service.handlePushNotiForInspection(
          ctx,
          customInspectionForm,
          group,
          inspectionItems,
        ),
      ).toEqual(undefined);
    });

    it('handlePushNotiForInspection push notification success', async () => {
      const customInspectionForm = new CustomInspectionForm();
      const mockOutputDeviceInspectionSettings = {
        userId: 'abc',
        searchId: '963918312',
        givenName: 'datbui',
        surname: 'dat',
        pictureUrl: 'string',
        email: 'sdnv2@gmail.com',
        isSearchableByEmail: true,
        registeredAt: '2024-01-03T04:43:58.000Z',
        isoLocaleCode: 'en',
        residenceCountryCode: 'JP',
        dateOfBirth: '2023',
        currentStatus: 'UPDATED',
        lastStatusUpdatedAt: '2024-01-03T04:44:10.000Z',
        devices: [],
      };
      mockedUserRepository.getUserDevicesInGroup.mockResolvedValue(
        mockOutputDeviceInspectionSettings,
      );

      const inspectionItems = {
        machineReportIds: [],
        machineReportResponseIds: [],
        inspectionId: '',
      };

      expect(
        await service.handlePushNotiForInspection(
          ctx,
          customInspectionForm,
          group,
          inspectionItems,
        ),
      ).toEqual(undefined);
    });
  });
  describe('updateInspectionFormName', () => {
    it('handlePushNotiForInspection push notification success', async () => {
      const customInspectionForm = new CustomInspectionForm();
      const mockOutputDeviceInspectionSettings = {
        userId: 'abc',
        searchId: '963918312',
        givenName: 'datbui',
        surname: 'dat',
        pictureUrl: 'string',
        email: 'sdnv2@gmail.com',
        isSearchableByEmail: true,
        registeredAt: '2024-01-03T04:43:58.000Z',
        isoLocaleCode: 'en',
        residenceCountryCode: 'JP',
        dateOfBirth: '2023-10-18',
        currentStatus: 'UPDATED',
        lastStatusUpdatedAt: '2024-01-03T04:44:10.000Z',
        devices: [],
      };
      mockedUserRepository.getUserDevicesInGroup.mockResolvedValue(
        mockOutputDeviceInspectionSettings,
      );

      const inspectionItems = {
        machineReportIds: [],
        machineReportResponseIds: [],
        inspectionId: '',
      };

      expect(
        await service.handlePushNotiForInspection(
          ctx,
          customInspectionForm,
          group,
          inspectionItems,
        ),
      ).toEqual(undefined);
    });
  });

  describe('syncInspectionData', () => {
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

    it('syncInspectionData: handleDataInspectionItemsư', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
            result: '12',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      mockedInspectionRepository.findOne.mockReturnValue({
        inspectionItem: [
          { itemCode: ItemCodeType.SERVICE_METER, result: '111' },
        ],
      });

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
        {
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Service meter/SMR (h)',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: true,
          isForcedRequired: true,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      jest
        .spyOn(mockedUserRepository, 'getUserByCiam')
        .mockReturnValue(mockUser);
      jest
        .spyOn(
          mockedUserGroupAssignmentRepository,
          'checkPermissionInGroupSyncData',
        )
        .mockReturnValue(mockUserGroupAssignment);
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      await service.syncInspectionData(group, ctx, params, input);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionRepo.insert).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('syncInspectionData: success', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.DRAFT,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
            result: '12',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };
      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      mockedInspectionRepository.findOne.mockReturnValue({
        inspectionItem: [
          { itemCode: ItemCodeType.SERVICE_METER, result: '111' },
        ],
      });

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
        {
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Service meter/SMR (h)',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: true,
          isForcedRequired: true,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);
      jest
        .spyOn(mockedUserRepository, 'getUserByCiam')
        .mockReturnValue(mockUser);
      jest
        .spyOn(
          mockedUserGroupAssignmentRepository,
          'checkPermissionInGroupSyncData',
        )
        .mockReturnValue(mockUserGroupAssignment);
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      await service.syncInspectionData(group, ctx, params, input);

      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionRepo.insert).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('syncInspectionData: success noti', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
          {
            inspectionResultId: '01HNCYHVZN3PAMFSFX522Q2K5X',
            inspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
            result: '12',
            itemCode: ItemCodeType.SERVICE_METER,
            resultType: CustomInspectionItemResultType.NUMERIC,
            isRequired: true,
          },
        ],
      };

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
        {
          customInspectionItemId: '01HMZSVHX4PR8G2C2C59CGPQKE',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Service meter/SMR (h)',
          resultType: CustomInspectionItemResultType.NUMERIC,
          isRequired: true,
          isImmutable: true,
          isForcedRequired: true,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: ItemCodeType.SERVICE_METER,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));

      const mockInspectionRepo = mockDataSource.getRepository(Inspection);
      const mockInspectionHistoryRepo =
        mockDataSource.getRepository(InspectionHistory);
      const mockInspectionResultRepo =
        mockDataSource.getRepository(InspectionResult);
      const mockInspectionResultHistoryRepo = mockDataSource.getRepository(
        InspectionResultHistory,
      );
      const mockMachineReportRepo = mockDataSource.getRepository(MachineReport);
      const mockMachineReportHistoryRepo =
        mockDataSource.getRepository(MachineReportHistory);
      const mockMachineReportResponseRepo = mockDataSource.getRepository(
        MachineReportResponse,
      );
      const mockMachineReportMediaRepo =
        mockDataSource.getRepository(MachineReportMedia);

      jest.spyOn(service, 'handlePushNotiForInspection').mockImplementation();

      const data = await service.syncInspectionData(group, ctx, params, input);

      expect(data).toEqual({
        data: {
          inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
          syncStatus: StatusName.SYNCED,
        },
        meta: { successMessage: undefined },
      });
      expect(spyTransaction).toHaveBeenCalled();
      expect(mockInspectionRepo.insert).toHaveBeenCalled();
      expect(mockInspectionHistoryRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultRepo.insert).toHaveBeenCalled();
      expect(mockInspectionResultHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportHistoryRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportResponseRepo.insert).toHaveBeenCalled();
      expect(mockMachineReportMediaRepo.insert).toHaveBeenCalled();
    });

    it('syncInspectionData: InspectionFormId not found.', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(undefined);
      try {
        await service.syncInspectionData(group, ctx, params, input);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual(
          'Custom inspection form not found or not in this machine.',
        );
      }
    });

    it('syncInspectionData: inspectionItem not found in inspectionForm', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      const mockCustomInspectionItem = {
        customInspectionItemId: '01HMZSVHX428TA98BH6VYZ3P5X',
        customInspectionFormId: '01HMZSVHWSEY5J7ZPQBY3G3497',
        name: 'Oil and coolant level of engine/hydraulic system',
        description:
          'Check the oil level of engine, hydraulic components, and coolant system.',
        resultType: 'OK_OR_ANOMARY',
        isRequired: true,
        isImmutable: false,
        isForcedRequired: false,
        position: 3,
        currentStatus: 'PUBLISHED',
        lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
        itemCode: null,
      };
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValueOnce(mockCustomInspectionItem);

      try {
        await service.syncInspectionData(group, ctx, params, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'inspectionItem not found in inspectionForm.',
        );
      }
    });

    it('syncInspectionData: InspectionFormId Deleted.', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC44',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 999.9,
            },
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.DELETED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      try {
        await service.syncInspectionData(group, ctx, params, input);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it('syncInspectionData: duplicate data.', async () => {
      const input: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        inspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
        lat: 122,
        lng: 123,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.IOS,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [
          {
            inspectionResultId: '01HNCYCVZN3PAMFSFX522Q2K5D',
            inspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
            itemCode: null,
            result: 'ANOMARY',
            resultType: CustomInspectionItemResultType.OK_OR_ANOMARY,
            isRequired: true,
            machineReport: {
              machineReportId: '01HCHJ6D2D0Z3EJ66E42KGX122',
              machineReportResponseId: '01HDHJ6B2D0Z3EJ66E42KGX115',
              reportComment: '',
              machineReportMedias: [
                {
                  machineReportMediaId: '23HDHJ6B2D0Z3EJ66E42KGX115',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
                {
                  machineReportMediaId: '2DHCHJ6B2D0Z3EJ66E42KGX135',
                  filePath: '/machine-reports/12345678-machine_name.png',
                  fileName: 'machine_name1.png',
                  mediaUrl: '/machine-reports/12345678-machine_name.png',
                  mimeType: 'image/bmp',
                },
              ],
              lat: 0,
              lng: 0,
              locationAccuracy: 'string',
              devicePlatform: DevicePlatform.IOS,
              reportTitle: 'string',
              serviceMeterInHour: 10,
            },
          },
        ],
      };
      const customInspectionForm = new CustomInspectionForm();
      customInspectionForm.customInspectionFormId =
        '01HM3FDV8CCCC34FZS397VGQCH';
      customInspectionForm.currentStatus =
        CustomInspectionFormCurrentStatus.PUBLISHED;

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );
      const mockCustomInspectionItem = [
        {
          customInspectionItemId: '01HCHJ6B2D0Z3EJ66E42KGXC22',
          customInspectionFormId: '01HM3FDV8CCCC34FZS397VGQCH',
          name: 'Oil and coolant level of engine/hydraulic system',
          description:
            'Check the oil level of engine, hydraulic components, and coolant system.',
          resultType: 'OK_OR_ANOMARY',
          isRequired: true,
          isImmutable: false,
          isForcedRequired: false,
          position: 3,
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: ' 2024-01-25T00:55:21.000Z',
          itemCode: null,
        },
      ];
      jest
        .spyOn(mockedCustomInspectionItemRepository, 'find')
        .mockReturnValue(mockCustomInspectionItem);

      mockedCustomInspectionFormRepository.findOne.mockReturnValue(
        customInspectionForm,
      );

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockRejectedValue({ message: 'Error: Violation of PRIMARY KEY' });

      const data = await service.syncInspectionData(group, ctx, params, input);

      expect(data).toEqual({
        data: {
          inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
          syncStatus: StatusName.SYNCED,
        },
        meta: {},
      });
      expect(spyTransaction).toHaveBeenCalled();
    });
  });

  describe('Get list user inspection posted for webapp', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const mockInspectionItems = {
      customInspectionItems: [
        {
          customInspectionItemId: '01HR3KSSWFGB3F2N85NMDWSFXN',
          name: 'Visual check around the work equipment',
          position: 0,
        },
        {
          customInspectionItemId: '01HR3KSSWFCKSF1TMB36AW5TBE',
          name: 'Visual check around the machine',
          position: 1,
        },
      ],
    };

    const query = new GetInspectionQuery();
    query.monthYear = '2024-02';
    query.customInspectionFormId = 'customInspectionFormIdVKWQ';

    it('should throw error when getInspectionsForWebapp service fail', async () => {
      mockedInspectionRepository.getInspectionsForWebapp.mockRejectedValue({
        message: 'Test error',
      });

      mockedCustomInspectionFormRepository.getCustomInspectionForm.mockResolvedValue(
        mockInspectionItems,
      );

      try {
        await service.getInspectionsForWebapp(ctx, mockParams, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should getListInspection successfully', async () => {
      const mockListInspectionOutput = [
        {
          inspectionId: 'inspectionIdEFEVHX96Q80V94',
          inspectionAt: '2024-02-23T17:20:39+00:00',
          machineId: 'machineIdJSZGJVBX9GGSGJ5EC',
          lat: 999,
          lng: 324,
          locationAccuracy: 'test',
          devicePlatform: 'IOS',
          currentStatus: 'POSTED',
          lastStatusUpdatedAt: '2024-02-23T14:50:39.000Z',
          customInspectionFormId: 'customInspectionFormIdVKWQ',
          inspectionHistories: [
            {
              inspectionHistoryId: 'inspectionHistoryIdADY5M0F',
              eventType: 'CREATE',
              actionedByUserId: 'actionedByUserIdG7NRWZFDFJ',
              eventAt: '2024-02-23T07:50:39.000Z',
              inspectionId: 'inspectionIdEFEVHX96Q80V94',
              inspectionAt: '2024-02-23T07:50:39.000Z',
              machineId: 'machineIdJSZGJVBX9GGSGJ5EC',
              lat: 999,
              lng: 324,
              locationAccuracy: 'test',
              currentStatus: 'POSTED',
              devicePlatform: 'IOS',
              customInspectionFormId: 'customInspectionFormIdVKWQ',
              user: {
                userId: 'actionedByUserIdG7NRWZFDFJ',
                searchId: '000000013',
                givenName: 'Go',
                surname: 'Nakano',
                pictureUrl:
                  'https://gyazo.com/fd302b1c65a87f040a12408aee9369fa',
                email: 'dung.diep@monstar-lab.com',
                isSearchableByEmail: false,
                registeredAt: '2023-10-10T02:03:29.000Z',
                isoLocaleCode: 'en',
                residenceCountryCode: 'O',
                dateOfBirth: null,
                currentStatus: 'UPDATED',
                lastStatusUpdatedAt: '2024-02-21T02:11:11.000Z',
              },
            },
          ],
          inspectionResults: [
            {
              inspectionResultId: 'inspectionResultIdTH5STM7C',
              result: 'OK',
              inspectionId: 'inspectionIdEFEVHX96Q80V94',
              customInspectionItemId: 'customInspectionItemId66E4',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: '2024-02-23T14:50:39.000Z',
              itemCode: null,
              customInspectionItemName: 'tê\\é',
              customInspectionItem: {
                customInspectionFormId: 'customInspectionFormIdVKWQ',
                customInspectionItemId: 'customInspectionItemId66E4',
                name: 'tê\\é',
                description: '1212',
                itemCode: 'SERVICE_METER',
                resultType: 'OK_OR_ANOMARY',
                isRequired: true,
                isImmutable: true,
                isForcedRequired: true,
                position: 1,
                lastStatusUpdatedAt: '2024-02-01T08:30:20.463Z',
                currentStatus: 'PUBLISHED',
              },
            },
          ],
        },
      ];

      mockedInspectionRepository.getInspectionsForWebapp.mockResolvedValue(
        mockListInspectionOutput,
      );

      mockedCustomInspectionFormRepository.getCustomInspectionForm.mockResolvedValue(
        mockInspectionItems,
      );

      const mockResponse = {
        meta: {},
        data: {
          customInspectionItems: mockInspectionItems,
          customInspections: mockListInspectionOutput,
        },
      };

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue({
          customInspectionItems: mockInspectionItems,
          customInspections: mockListInspectionOutput,
        }),
      });

      const response = await service.getInspectionsForWebapp(
        ctx,
        mockParams,
        query,
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });

  describe('generateInspectionPdf', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const query = new GetInspectionQuery();
    query.monthYear = '2024-02';
    query.customInspectionFormId = 'customInspectionFormIdVKWQ';

    let launchMock;

    const mockInspectionItems = [
      {
        customInspectionItemId: 'customInspectionItemId66E4',
        name: 'Visual check around the work equipment',
        position: 0,
      },
      {
        customInspectionItemId: 'customInspectionItemId66E5',
        name: 'Visual check around the machine',
        position: 1,
      },
      {
        customInspectionItemId: 'customInspectionItemId66E6',
        name: 'Visual check around the machine 2',
        position: 1,
      },
    ];

    beforeEach(() => {
      // Create a mock for puppeteer launch function
      launchMock = jest.fn();
      launchMock.mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          setContent: jest.fn(),
          emulateMediaType: jest.fn(),
          evaluate: jest.fn(),
          pdf: jest.fn().mockResolvedValue('PDF buffer'),
        }),
        close: jest.fn(),
      });

      // Mock puppeteer module
      puppeteer.launch = launchMock;
    });

    it('should throw error when generateInspectionPdf service fail', async () => {
      mockedCustomInspectionFormRepository.getInspectionForm.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await service.generateInspectionPdf(ctx, mockParams, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should generateInspectionPdf successfully', async () => {
      const mockListInspectionOutput = [];
      for (let i = 0; i <= 1; i++) {
        mockListInspectionOutput.push({
          userId: 'actionedByUserIdG7NRWZFDFJ',
          searchId: '000000013',
          givenName: 'Go',
          surname: 'Nakano',
          pictureUrl: 'https://gyazo.com/fd302b1c65a87f040a12408aee9369fa',
          email: 'user-test@gmail.com',
          isSearchableByEmail: false,
          registeredAt: '2023-10-10T02:03:29.000Z',
          isoLocaleCode: 'en',
          residenceCountryCode: 'O',
          dateOfBirth: null,
          inspectionId: 'inspectionIdEFEVHX96Q80V94',
          inspectionAt: '2024-02-23T17:20:39+00:00',
          machineId: 'machineIdJSZGJVBX9GGSGJ5EC',
          lat: 999,
          lng: 324,
          locationAccuracy: 'test',
          devicePlatform: 'IOS',
          currentStatus: 'POSTED',
          lastStatusUpdatedAt: '2024-02-23T14:50:39.000Z',
          customInspectionFormId: 'customInspectionFormIdVKWQ',
          inspectionHistories: [
            {
              inspectionHistoryId: 'inspectionHistoryIdADY5M0F',
              eventType: 'CREATE',
              actionedByUserId: 'actionedByUserIdG7NRWZFDFJ',
              eventAt: '2024-02-23T07:50:39.000Z',
              inspectionId: 'inspectionIdEFEVHX96Q80V94',
              inspectionAt: '2024-02-23T07:50:39.000Z',
              machineId: 'machineIdJSZGJVBX9GGSGJ5EC',
              lat: 999,
              lng: 324,
              locationAccuracy: 'test',
              currentStatus: 'POSTED',
              devicePlatform: 'IOS',
              customInspectionFormId: 'customInspectionFormIdVKWQ',
              user: {
                userId: 'actionedByUserIdG7NRWZFDFJ',
                searchId: '000000013',
                givenName: 'Go',
                surname: 'Nakano',
                pictureUrl:
                  'https://gyazo.com/fd302b1c65a87f040a12408aee9369fa',
                email: 'user-test@gmail.com',
                isSearchableByEmail: false,
                registeredAt: '2023-10-10T02:03:29.000Z',
                isoLocaleCode: 'en',
                residenceCountryCode: 'O',
                dateOfBirth: null,
                currentStatus: 'UPDATED',
                lastStatusUpdatedAt: '2024-02-21T02:11:11.000Z',
              },
            },
          ],
          inspectionResults: [
            {
              inspectionResultId: 'inspectionResultIdTH5STM7C',
              result: 'OK',
              inspectionId: 'inspectionIdEFEVHX96Q80V94',
              customInspectionItemId: 'customInspectionItemId66E4',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: '2024-02-23T14:50:39.000Z',
              itemCode: null,
              machineReport: null,
            },
            {
              inspectionResultId: 'inspectionResultIdTH5STM7C',
              result: '12.4',
              inspectionId: 'inspectionIdEFEVHX96Q80V94',
              customInspectionItemId: 'customInspectionItemId66E5',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: '2024-04-03T08:27:36.000Z',
              itemCode: 'SERVICE_METER',
              machineReport: null,
            },
            {
              inspectionResultId: 'inspectionResultIdTH5STM7C',
              result: '10.0',
              inspectionId: 'inspectionIdEFEVHX96Q80V95',
              customInspectionItemId: 'customInspectionItemId66E6',
              currentStatus: 'POSTED',
              lastStatusUpdatedAt: '2024-04-03T08:27:36.000Z',
              itemCode: 'SERVICE_METER',
              machineReport: null,
            },
          ],
        });
      }
      const mockInspectionForm = {
        inspectionFormName: 'inspection form name',
        groupName: 'group name',
        machineName: 'machine4',
        modelAndType: 'string',
        serialNumber: '123',
        customMachineManufacturerName: null,
        customTypeName: null,
        machineManufacturerName: 'KOMATSU',
        machineType: 'MOBILE CRUSHER',
      };

      mockI18n.t.mockReturnValue({
        groupName: 'Group name',
        manufacturer: 'Manufacturer',
        machineType: 'Machine type',
        customerMachineNumber: 'Customer Machine Number',
        modelType: 'Model -Type',
        serialNumber: 'Serial Number',
        sign: 'Sign',
        inspectionItem: 'Inspection item',
        inspector: 'Inspector',
      });

      mockedCustomInspectionFormRepository.getInspectionForm.mockReturnValue(
        mockInspectionForm,
      );

      mockedInspectionRepository.getInspectionsForWebapp.mockResolvedValue(
        mockListInspectionOutput,
      );

      mockedCustomInspectionFormRepository.getCustomInspectionForm.mockResolvedValue(
        mockInspectionItems,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue({
          customInspectionItems: mockInspectionItems,
          customInspections: mockListInspectionOutput,
        }),
      });

      // Mock the HTML content
      const htmlContent =
        '<html><body><div id="check-inspectioni-detail"></div></body></html>';

      // Mock fs.readFileSync to return the HTML content
      jest.spyOn(fs, 'readFileSync').mockReturnValue(htmlContent);

      const response = await service.generateInspectionPdf(
        ctx,
        mockParams,
        query,
      );

      expect(response).toEqual('PDF buffer');
      expect(launchMock).toHaveBeenCalled();
      const browser = await launchMock();
      expect(browser.newPage).toHaveBeenCalled();
      const page = await browser.newPage();
      expect(page.setContent).toHaveBeenCalledWith(htmlContent, {
        waitUntil: 'domcontentloaded',
      });
      expect(page.emulateMediaType).toHaveBeenCalledWith('screen');
      expect(page.pdf).toHaveBeenCalled();
      expect(browser.close).toHaveBeenCalled();
    });
  });
});
