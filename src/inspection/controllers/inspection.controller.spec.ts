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
  ListInspectionOutput,
  SyncInspectionDataInput,
  UpdateInspectionFormInput,
  UpdateInspectionInput,
} from '@inspection/dtos';
import { InspectionService } from '@inspection/services/inspection.service';
import { Machine } from '@machine/entities';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CustomInspectionFormCurrentStatus,
  DevicePlatform,
  InspectionCurrentStatus,
  InspectionFormType,
  ISOLocaleCode,
  Platform,
} from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  UserCiamLinkRepository,
  UserGroupAssignmentRepository,
  UserRepository,
} from '@user/repositories';
import { I18nService } from 'nestjs-i18n';

import { InspectionController } from './inspection.controller';

describe('InspectionController', () => {
  let controller: InspectionController;
  const mockedLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  const mockI18n = { t: jest.fn() };

  const mockedInspectionService = {
    getListInspectionForm: jest.fn(),
    getListUserInspectionFormDraft: jest.fn(),
    getListTemplateAndCreatedInspectionForm: jest.fn(),
    deleteInspectionForm: jest.fn(),
    updateInspectionForm: jest.fn(),
    createInspectionForm: jest.fn(),
    getInspectionItemTemplates: jest.fn(),
    getInspectionItems: jest.fn(),
    createInspection: jest.fn(),
    getListUserInspectionDraft: jest.fn(),
    getInspectionDetail: jest.fn(),
    updateInspection: jest.fn(),
    getListInspection: jest.fn(),
    getInspectionsForWebapp: jest.fn(),
    syncInspectionData: jest.fn(),
    generateInspectionPdf: jest.fn(),
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

  const mockUserCiamLinkRepository = {
    userCiamLinkRepository: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionController],
      providers: [
        {
          provide: AppLogger,
          useValue: mockedLogger,
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: I18nService,
          useValue: mockI18n,
        },
        {
          provide: InspectionService,
          useValue: mockedInspectionService,
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

    controller = module.get<InspectionController>(InspectionController);
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
  group.machines[0].machineTypeId = machineTypeId;
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteInspectionForm', () => {
    const params: InspectionFormParam = {
      groupId,
      machineId: machineId,
      customInspectionFormId: 'inspectionFromN9Q036EJ6PRDW',
    };

    it('should return delete inspection form message', async () => {
      mockedInspectionService.deleteInspectionForm.mockResolvedValue({
        data: {},
        meta: {
          successMessage: 'Deleted successfully.',
        },
      });

      mockI18n.t.mockReturnValue('Deleted successfully.');

      const result = await controller.deleteInspectionForm(ctx, params);

      expect(result.data).toEqual({});
      expect(result.meta).toEqual({ successMessage: 'Deleted successfully.' });
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.deleteInspectionForm.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.deleteInspectionForm(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('Get list inspection form', () => {
    it('should return list inspection form', async () => {
      const returnValues = [
        {
          customInspectionFormId: 'customInspectionQA36EJ6PW7',
          name: 'customInspection',
        },
      ];

      mockedInspectionService.getListInspectionForm.mockResolvedValue(
        returnValues,
      );
      const groups = await controller.getListInspectionForm(ctx, params);
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(
        mockedInspectionService.getListInspectionForm,
      ).toHaveBeenCalledWith(ctx, params);
    });

    it('should return array of null', async () => {
      mockedInspectionService.getListInspectionForm.mockResolvedValue([]);

      const groups = await controller.getListInspectionForm(ctx, params);
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getListInspectionForm.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getListInspectionForm(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get list user inspection form draft', () => {
    it('should return user list inspection form', async () => {
      const returnValues = [
        {
          customInspectionFormId: 'customInspectionQA36EJ6PW7',
          name: 'customInspection',
          lastStatusUpdatedAt: new Date(),
        },
      ];

      mockedInspectionService.getListUserInspectionFormDraft.mockResolvedValue(
        returnValues,
      );
      const groups = await controller.getListUserInspectionFormDraft(
        ctx,
        params,
      );
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(
        mockedInspectionService.getListUserInspectionFormDraft,
      ).toHaveBeenCalledWith(ctx, params);
    });

    it('should return array of null', async () => {
      mockedInspectionService.getListUserInspectionFormDraft.mockResolvedValue(
        [],
      );

      const groups = await controller.getListUserInspectionFormDraft(
        ctx,
        params,
      );
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getListUserInspectionFormDraft.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getListInspectionForm(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get list template, created inspection form', () => {
    it('should return template, created inspection form', async () => {
      const returnValues = {
        inspectionFormTemplates: [
          {
            inspectionFormTemplateId: 'templateInspectionQA36EJ6PW7',
            inspectionFormTemplateName: 'templateInspectionName',
          },
        ],
        customInspectionForms: [
          {
            customInspectionFormId: 'customInspectionQA36EJ6PW7',
            name: 'customInspection',
          },
        ],
      };

      mockedInspectionService.getListTemplateAndCreatedInspectionForm.mockResolvedValue(
        returnValues,
      );
      const inspections = await controller.getListInspectionFormTemplate(
        ctx,
        params,
        group,
      );
      expect(inspections).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(
        mockedInspectionService.getListTemplateAndCreatedInspectionForm,
      ).toHaveBeenCalledWith(ctx, params, group.machines[0].machineTypeId);
    });

    it('should return array of null', async () => {
      mockedInspectionService.getListTemplateAndCreatedInspectionForm.mockResolvedValue(
        { inspectionFormTemplates: [], customInspectionForms: [] },
      );

      const inspections = await controller.getListInspectionFormTemplate(
        ctx,
        params,
        group,
      );
      expect(inspections.data.customInspectionForms).toHaveLength(0);
      expect(inspections.data.inspectionFormTemplates).toHaveLength(0);
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getListTemplateAndCreatedInspectionForm.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getListInspectionFormTemplate(ctx, params, group);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('createInspectionForm', () => {
    const params = {
      machineId,
      groupId,
    };

    const body: CreateInspectionFormInput = {
      inspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
      inspectionFormType: InspectionFormType.CUSTOM,
      name: 'string',
      currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
      customInspectionItems: [],
    };

    it('should createInspectionForm success', async () => {
      const mockOutput = {
        data: {
          customInspectionFormId: '01HP0QEM3H0B4AYVXBZJMV5EEC',
        },
        meta: {},
      };

      mockedInspectionService.createInspectionForm.mockReturnValue(mockOutput);

      expect(await controller.createInspectionForm(ctx, params, body)).toEqual(
        mockOutput,
      );
    });

    it('should createInspectionForm false', async () => {
      mockedInspectionService.createInspectionForm.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.createInspectionForm(ctx, params, body);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });
  });

  describe('updateInspectionForm', () => {
    const params = {
      machineId,
      groupId,
      customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
    };

    const group = {
      machines: [
        {
          customInspectionForms: [
            {
              customInspectionFormId: '01HKVSZSG67804PXX5K3VM9AG7',
            },
          ],
        },
      ],
    } as any;

    const body: UpdateInspectionFormInput = {
      name: 'string',
      currentStatus: CustomInspectionFormCurrentStatus.DRAFT,
      customInspectionItems: [],
    };

    const mockOutput = {
      data: {
        customInspectionFormId: '01HP0QEM3H0B4AYVXBZJMV5EEC',
      },
      meta: {},
    };
    it('should updateInspectionForm success', async () => {
      mockedInspectionService.updateInspectionForm.mockReturnValue(mockOutput);

      expect(
        await controller.updateInspectionForm(ctx, params, body, group),
      ).toEqual(mockOutput);
    });

    it('should updateInspectionForm false', async () => {
      mockedInspectionService.updateInspectionForm.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.updateInspectionForm(ctx, params, body, group);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });
  });

  describe('Get list inspection item templates', () => {
    it('should return list inspection item templates', async () => {
      const returnValues = {
        inspectionFormId: 'InspectionQAOEKWOS84A36EJ6PW7',
        type: 'TEMPLATE',
        name: 'inspection',
        inspectionItems: [
          {
            inspectionItemId: 'inspectionFormId',
            name: 'item1',
            description: 'test',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            inspectionItemMedias: [
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
      mockedInspectionService.getInspectionItemTemplates.mockResolvedValue(
        returnValues,
      );
      const inspections = await controller.getListInspectionItemTemplate(
        ctx,
        paramsInspectionTemplate,
      );
      expect(inspections).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(
        mockedInspectionService.getInspectionItemTemplates,
      ).toHaveBeenCalledWith(ctx, paramsInspectionTemplate);
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getInspectionItemTemplates.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getListInspectionItemTemplate(
          ctx,
          paramsInspectionTemplate,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get list inspection items', () => {
    it('should return list inspection items', async () => {
      const returnValues = {
        inspectionFormId: 'InspectionQAOEKWOS84A36EJ6PW7',
        name: 'inspection',
        type: 'CUSTOM',
        inspectionItems: [
          {
            inspectionItemId: 'inspectionFormId',
            name: 'item1',
            description: 'test',
            resultType: 'OK_OR_ANOMARY',
            isImmutable: true,
            isForcedRequired: true,
            inspectionItemMedias: [
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
      mockedInspectionService.getInspectionItems.mockResolvedValue(
        returnValues,
      );
      const inspections = await controller.getListInspectionItem(
        ctx,
        paramsInspectionForm,
      );
      expect(inspections).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedInspectionService.getInspectionItems).toHaveBeenCalledWith(
        ctx,
        paramsInspectionForm,
      );
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getInspectionItems.mockRejectedValue(new Error());

      try {
        await controller.getListInspectionItem(ctx, paramsInspectionForm);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get list user inspection draft', () => {
    it('should return user list inspection draft', async () => {
      const returnValues = [
        {
          inspectionId: 'inspectionQA36EJ6PW7123456',
          name: 'inspection',
          lastStatusUpdatedAt: new Date(),
        },
      ];

      mockedInspectionService.getListUserInspectionDraft.mockResolvedValue(
        returnValues,
      );
      const inspection = await controller.getListUserInspectionDraft(
        ctx,
        params,
      );
      expect(inspection).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(
        mockedInspectionService.getListUserInspectionDraft,
      ).toHaveBeenCalledWith(ctx, params);
    });

    it('should return array of null', async () => {
      mockedInspectionService.getListUserInspectionDraft.mockResolvedValue([]);

      const groups = await controller.getListUserInspectionDraft(ctx, params);
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getListUserInspectionDraft.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getListUserInspectionDraft(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get list user inspection posted', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const query = new GetInspectionQuery();
    query.limit = 1;

    it('should throw error when getListInspection service fail', async () => {
      mockedInspectionService.getListInspection.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getListInspection(ctx, mockParams, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should getListInspection successfully', async () => {
      const mockListInspectionOutput: ListInspectionOutput = {
        inspectionId: 'inspectionQA36EJ6PW7123456',
        name: 'inspection',
        lastStatusUpdatedAt: new Date(),
        inspectionReportCount: 1,
      };

      const mockResponse = {
        meta: { pageInfo: { nextPage: false } },
        data: [mockListInspectionOutput],
      };

      mockedInspectionService.getListInspection.mockReturnValue(mockResponse);

      const response = await controller.getListInspection(
        ctx,
        mockParams,
        query,
      );

      expect(response.data).toEqual(mockResponse.data);
      expect(response.meta).toEqual(mockResponse.meta);
    });
  });

  describe('Get inspection detail', () => {
    const params: GroupMachineInspectionParam = {
      machineId,
      groupId,
      inspectionId: 'inspectionA3F83JK5KRHA22YSH',
    };

    it('should return inspection detail', async () => {
      const returnValues = {
        inspectionFormId: '01HMFMCFGA5J3C23CK7B3MA3PJ',
        type: 'INSPECTION',
        name: 'string',
        currentStatus: 'DRAFT',
      };

      mockedInspectionService.getInspectionDetail.mockResolvedValue(
        returnValues,
      );
      const inspection = await controller.getInspectionDetail(ctx, params);
      expect(inspection).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedInspectionService.getInspectionDetail).toHaveBeenCalledWith(
        ctx,
        params,
      );
    });

    it('should throw error when inspectionService fail', async () => {
      mockedInspectionService.getInspectionDetail.mockRejectedValue(
        new Error(),
      );

      try {
        await controller.getInspectionDetail(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Create inspection', () => {
    it('should create inspection success', async () => {
      const mockInput: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 123,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.ANDROID,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [],
      };
      const mockOutput = {
        data: {},
        meta: {},
      };
      mockedInspectionService.createInspection.mockResolvedValue(mockOutput);
      expect(
        await controller.createInspection(ctx, params, mockInput, group),
      ).toEqual(mockOutput);
      expect(mockedInspectionService.createInspection).toHaveBeenCalledWith(
        ctx,
        params,
        mockInput,
        group,
      );
    });

    it('should create inspection error', async () => {
      const mockInput: CreateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 123,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.ANDROID,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [],
      };
      mockedInspectionService.createInspection.mockRejectedValue(new Error());

      try {
        await controller.createInspection(ctx, params, mockInput, group);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Update inspection', () => {
    it('should Update inspection success', async () => {
      const mockInput: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 123,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.ANDROID,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [],
      };
      const mockOutput = {
        data: {},
        meta: {},
      };
      mockedInspectionService.updateInspection.mockResolvedValue(mockOutput);
      expect(
        await controller.updateInspection(
          ctx,
          paramsInspection,
          mockInput,
          group,
        ),
      ).toEqual(mockOutput);
      expect(mockedInspectionService.updateInspection).toHaveBeenCalledWith(
        ctx,
        paramsInspection,
        mockInput,
        group,
      );
    });

    it('should update inspection error', async () => {
      const mockInput: UpdateInspectionInput = {
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        lat: 123,
        lng: 324,
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.ANDROID,
        currentStatus: InspectionCurrentStatus.POSTED,
        inspectionItems: [],
      };
      mockedInspectionService.updateInspection.mockRejectedValue(new Error());

      try {
        await controller.updateInspection(
          ctx,
          paramsInspection,
          mockInput,
          group,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('syncInspectionData', () => {
    it('should syncInspectionData success', async () => {
      const mockInput: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        lat: 123,
        lng: 324,
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.ANDROID,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [],
      };
      const mockOutput = {
        data: {},
        meta: {},
      };
      mockedInspectionService.syncInspectionData.mockResolvedValue(mockOutput);
      expect(
        await controller.syncInspectionData(
          group,
          ctx,
          paramsInspection,
          mockInput,
        ),
      ).toEqual(mockOutput);
      expect(mockedInspectionService.syncInspectionData).toHaveBeenCalledWith(
        group,
        ctx,
        paramsInspection,
        mockInput,
      );
    });

    it('should syncInspectionData error', async () => {
      const mockInput: SyncInspectionDataInput = {
        inspectionId: '01HCHJ6B111Z3EJ66E42KGXC4D',
        lat: 123,
        lng: 324,
        inspectionFormId: '01HCHJ6B2D0Z3EJ66E42KGXC11',
        locationAccuracy: 'test',
        devicePlatform: DevicePlatform.ANDROID,
        currentStatus: InspectionCurrentStatus.POSTED,
        lastStatusUpdatedAt: new Date(),
        inspectionItems: [],
      };
      mockedInspectionService.syncInspectionData.mockRejectedValue(new Error());

      try {
        await controller.syncInspectionData(
          group,
          ctx,
          paramsInspection,
          mockInput,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Get list user inspection posted for webapp', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const query = new GetInspectionQuery();
    query.monthYear = '2024-02';
    query.customInspectionFormId = 'customInspectionFormIdVKWQ';

    const header = Platform.WEBAPP;

    it('should throw error when getListInspection service fail', async () => {
      mockedInspectionService.getInspectionsForWebapp.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getListInspection(ctx, mockParams, query, header);
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

      const mockResponse = {
        meta: {},
        data: mockListInspectionOutput,
      };

      mockedInspectionService.getInspectionsForWebapp.mockReturnValue(
        mockResponse,
      );

      const response = await controller.getListInspection(
        ctx,
        mockParams,
        query,
        header,
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

    it('should throw error when generateInspectionPdf service fail', async () => {
      mockedInspectionService.generateInspectionPdf.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.generateInspectionPdf(ctx, mockParams, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should generateInspectionPdf successfully', async () => {
      const mockInspectionPdfOutput = {
        type: 'Buffer',
        data: Buffer.from('Mock PDF Buffer'),
      };

      mockedInspectionService.generateInspectionPdf.mockResolvedValue(
        mockInspectionPdfOutput,
      );

      const response = await controller.generateInspectionPdf(
        ctx,
        mockParams,
        query,
      );

      expect(response.data).toEqual(mockInspectionPdfOutput);
    });
  });
});
