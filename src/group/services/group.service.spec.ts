import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import { createMock } from '@golevelup/ts-jest';
import {
  CreateGroupInput,
  DeleteGroupsInput,
  GetGroupInspectionFormQuery,
  GetGroupsBaseOutput,
  GetGroupsQuery,
  GetMachineInGroupWebappQuery,
  GroupAvailableMachineOutput,
  GroupAvailableMachineQuery,
  GroupCandidateUserQuery,
  GroupDetailInfoOutput,
  GroupInviteUserInput,
  GroupMachineParam,
  GroupParam,
  GroupsUserArchiveStatusInput,
  GroupUserParam,
  MachinesAssignIntoGroupInput,
  PermissionInGroupOutput,
  UpdateGroupInput,
  UpdateMachineInGroupInput,
  UserAssignmentInfoOutput,
  UserGroupAssignmentUpdateInput,
} from '@group/dtos';
import { Group, GroupHistory, GroupInvitation } from '@group/entities';
import { GroupInvitationRepository } from '@group/repositories';
import { GroupRepository } from '@group/repositories/group.repository';
import {
  CustomInspectionFormRepository,
  CustomInspectionItemMediaRepository,
  CustomInspectionItemRepository,
} from '@inspection/repositories';
import {
  MachineFavoriteOutput,
  UpdateMachineConditionInput,
} from '@machine/dtos';
import { MachineInput } from '@machine/dtos';
import {
  Machine,
  MachineCondition,
  MachineConditionHistory,
  MachineHistory,
  UserGroupMachineFavorite,
} from '@machine/entities';
import {
  MachineManufacturerRepository,
  MachineRepository,
  MachineTypeRepository,
} from '@machine/repositories';
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GroupCurrentStatus,
  GroupMachineCondition,
  ISOLocaleCode,
  MACHINE_MANUFACTURER_KMT,
  MachineCurrentStatus,
  MachineFavoriteResponse,
  MachineField,
  UserCurrentStatus,
  UserGroupArchiveStatus,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { BaseApiResponse, UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ReportActionChoiceRepository } from '@template/repositories';
import {
  UserGroupAssignment,
  UserGroupPermissionAssignment,
  UserGroupPermissionInvitation,
} from '@user/entities';
import {
  UserGroupAssignmentRepository,
  UserGroupSettingRepository,
} from '@user/repositories';
import { UserRepository } from '@user/repositories/user.repository';
import {
  UserGroupRoleNameTranslation,
  UserGroupRoleTemplate,
  UserGroupRoleTemplatePermissionAssignment,
} from '@user-group-role-template/entities';
import { PermissionRepository } from '@user-group-role-template/repositories';
import { UserGroupRoleTemplateRepository } from '@user-group-role-template/repositories/user-group-role-template.repository';
import { plainToInstance } from 'class-transformer';
import * as classTransformerModule from 'class-transformer';
import { I18nService } from 'nestjs-i18n';
import { DataSource, UpdateResult } from 'typeorm';

import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupService;
  let dataSource: DataSource;
  const mockedRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    getListGroupByIds: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    getGroupDetailById: jest.fn(),
    getGroupsForWebapp: jest.fn(),
    countGroupForWebapp: jest.fn(),
    getGroupDetail: jest.fn(),
  };
  const mockI18n = { t: jest.fn() };

  const mockUserGroupRoleTemplateRepository = {
    getTemplateRoleManager: jest.fn(),
    getRoleTemplateManager: jest.fn(),
    getUserAssignmentInfo: jest.fn(),
    getRoleTemplateOther: jest.fn(),
  };

  const mockedUserGroupAssignmentRepository = {
    getUserGroupAssignmentPermissions: jest.fn(),
    find: jest.fn(),
    getUserPermissionInGroups: jest.fn(),
    checkPermissionGroups: jest.fn(),
  };

  const mockPermissionRepository = {
    getPermissionByIds: jest.fn(),
    getPermissionByResourceAndOperation: jest.fn(),
  };

  const mockedUserRepository = {
    getGroupUsers: jest.fn(),
    getUserInvitee: jest.fn(),
    getUserGroupAssignment: jest.fn(),
    getGroupCandidateUserBySearch: jest.fn(),
    getListMachineReport: jest.fn(),
    getListMachineHistory: jest.fn(),
  };

  const mockGroupInvitationRepository = {
    getGroupInvitation: jest.fn(),
  };

  const mockUserGroupSettingRepository = {
    update: jest.fn(),
  };

  const mockMachineManufacturerRepository = {
    findOne: jest.fn(),
  };

  const mockMachineTypeRepository = {
    findOne: jest.fn(),
  };

  const mockMachineRepository = {
    getMachinesInGroup: jest.fn(),
    getMachinesByMachineIds: jest.fn(),
    checkMachineExistsInGroup: jest.fn(),
    groupMachineSuggestions: jest.fn(),
    getMachineDetailInfo: jest.fn(),
    findOne: jest.fn(),
    getMachineInGroup: jest.fn(),
    getMachineInGroupById: jest.fn(),
    getMachineHistories: jest.fn(),
    getMachineReportById: jest.fn(),
    getMachinesInGroupForWebapp: jest.fn(),
    countMachinesInGroupForWebapp: jest.fn(),
    getGroupMachineConditionDetail: jest.fn(),
    groupMachineSuggestionsBySearch: jest.fn(),
    getMachineFieldsInGroup: jest.fn(),
    getMachineServiceMeter: jest.fn(),
    countMachineReportForWebapp: jest.fn(),
    countMachineReport: jest.fn(),
  };

  const mockBlobStorageService = {
    generateSasUrl: jest.fn(),
  };

  const mockBlobStorageFileService = {
    getFileContent: jest.fn(),
  };

  const mockCustomInspectionFormRepository = {
    countGroupInspectionForms: jest.fn(),
    getGroupInspectionForms: jest.fn(),
    countGroupInspectionFormStatus: jest.fn(),
    getInspectionFormsInGroup: jest.fn(),
  };

  const mockCustomInspectionItemRepository = {
    getCustomInspectionItemsInGroup: jest.fn(),
  };
  const mockCustomInspectionItemMediaRepository = {
    getCustomInspectionItemMediasInGroup: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetModules();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
        {
          provide: I18nService,
          useValue: mockI18n,
        },
        {
          provide: GroupRepository,
          useValue: mockedRepository,
        },
        {
          provide: UserGroupRoleTemplateRepository,
          useValue: mockUserGroupRoleTemplateRepository,
        },
        {
          provide: PermissionRepository,
          useValue: mockPermissionRepository,
        },
        {
          provide: GroupInvitationRepository,
          useValue: mockGroupInvitationRepository,
        },
        {
          provide: UserGroupAssignmentRepository,
          useValue: mockedUserGroupAssignmentRepository,
        },
        {
          provide: UserRepository,
          useValue: mockedUserRepository,
        },
        {
          provide: UserGroupSettingRepository,
          useValue: mockUserGroupSettingRepository,
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
          provide: BlobStorageFileService,
          useValue: mockBlobStorageFileService,
        },
        {
          provide: MachineRepository,
          useValue: mockMachineRepository,
        },
        {
          provide: MachineManufacturerRepository,
          useValue: mockMachineManufacturerRepository,
        },
        {
          provide: CustomInspectionFormRepository,
          useValue: mockCustomInspectionFormRepository,
        },
        {
          provide: MachineTypeRepository,
          useValue: mockMachineTypeRepository,
        },
        { provide: ReportActionChoiceRepository, useValue: {} },
        {
          provide: CustomInspectionFormRepository,
          useValue: mockCustomInspectionFormRepository,
        },
        {
          provide: CustomInspectionItemRepository,
          useValue: mockCustomInspectionItemRepository,
        },
        {
          provide: CustomInspectionItemMediaRepository,
          useValue: mockCustomInspectionItemMediaRepository,
        },
      ],
    }).compile();
    service = module.get<GroupService>(GroupService);
    dataSource = module.get<DataSource>(DataSource);
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;
  ctx.isoLocaleCode = ISOLocaleCode.EN;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const query = new GetGroupsQuery();
    it('get groups as a list success: isArchived = false', async () => {
      query.status = UserGroupArchiveStatus.UNARCHIVED;
      const timeNow = new Date();
      const expectedOutput: GetGroupsBaseOutput = {
        archivedGroups: [],
        unarchivedGroups: [
          {
            groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
            groupName: 'group name',
            location: 'location name',
            currentStatus: GroupCurrentStatus.CREATED,
            isArchived: false,
            lastStatusUpdatedAt: timeNow,
            userAssignmentCount: 1,
            machineAssignmentCount: 1,
            allowEditDeleteGroup: false,
            companyName: 'company name',
          },
        ],
      };
      mockPermissionRepository.getPermissionByResourceAndOperation.mockResolvedValue(
        {
          permissionId: 'permissionSAVCGDC8DMP74E',
        },
      );
      mockedRepository.findAll.mockResolvedValue([
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          groupName: 'group name',
          location: 'location name',
          currentStatus: GroupCurrentStatus.CREATED,
          isArchived: false,
          lastStatusUpdatedAt: timeNow,
          userAssignmentCount: 1,
          machineAssignmentCount: 1,
          allowEditDeleteGroup: false,
          companyName: 'company name',
        },
      ]);

      expect(await service.findAll(ctx, query)).toEqual(expectedOutput);
    });

    it('get groups as a list success: isArchived = true', async () => {
      query.status = UserGroupArchiveStatus.ARCHIVED;
      const timeNow = new Date();
      const expectedOutput: GetGroupsBaseOutput = {
        archivedGroups: [
          {
            groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
            groupName: 'group name',
            location: 'location name',
            currentStatus: GroupCurrentStatus.CREATED,
            isArchived: true,
            lastStatusUpdatedAt: timeNow,
            userAssignmentCount: 1,
            machineAssignmentCount: 1,
            allowEditDeleteGroup: false,
            companyName: 'company name',
          },
        ],
        unarchivedGroups: [],
      };

      mockPermissionRepository.getPermissionByResourceAndOperation.mockResolvedValue(
        {
          permissionId: 'permissionSAVCGDC8DMP74E',
        },
      );
      mockedRepository.findAll.mockResolvedValue([
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          groupName: 'group name',
          location: 'location name',
          currentStatus: GroupCurrentStatus.CREATED,
          isArchived: true,
          lastStatusUpdatedAt: timeNow,
          userAssignmentCount: 1,
          machineAssignmentCount: 1,
          allowEditDeleteGroup: false,
          companyName: 'company name',
        },
      ]);

      expect(await service.findAll(ctx, query)).toEqual(expectedOutput);
    });

    it('should return array of null', async () => {
      const expectedOutput: GetGroupsBaseOutput = {
        archivedGroups: [],
        unarchivedGroups: [],
      };
      mockedRepository.findAll.mockResolvedValue([]);

      expect(await service.findAll(ctx, query)).toEqual(expectedOutput);
    });

    mockPermissionRepository.getPermissionByResourceAndOperation.mockResolvedValue(
      {
        permissionId: 'permissionSAVCGDC8DMP74E',
      },
    );

    it('should throw error when groupRepository fail', async () => {
      mockedRepository.findAll.mockRejectedValue(new BadRequestException());

      try {
        await service.findAll(ctx, query);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getGroupUsers', () => {
    it('should return list user when getGroupUsers success', async () => {
      const mockGetGroupUsers = [
        {
          userId: 'userYE1S2NCG2HXHP4R35R6J0N',
          givenName: 'given name',
          surname: 'surname',
          pictureUrl: '/mypicture?sas=1234567890',
          email: 'email@email',
          registeredAt: '2023-10-17T04:59:14.843Z',
          isoLocaleCode: 'ja',
          companyName: 'company name',
          userGroupAssignments: [
            {
              userId: 'userYE1S2NCG2HXHP4R35R6J0N',
              groupId: 'groupId1234567891311121415',
              lastActiveAt: '2023-10-17T04:59:14.843Z',
              currentStatus: 'USER_GROUP_ASSIGNMENT_START',
              userGroupRoleName: 'user group role name',
              userGroupRoleNameTranslation: {
                userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
                isoLocaleCode: 'ja',
                roleName: 'Site manager',
              },
            },
          ],
        },
      ];

      mockedUserRepository.getGroupUsers.mockReturnValue(mockGetGroupUsers);

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockGetGroupUsers[0].pictureUrl,
      );

      const result = await service.getGroupUsers(ctx, groupId);

      expect(result).toEqual([
        {
          ...mockGetGroupUsers[0],
          userGroupAssignment: mockGetGroupUsers[0].userGroupAssignments[0],
          pictureUrl: '/mypicture?sas=1234567890',
        },
      ]);
    });

    it('should return list user when getGroupUsers in user repository fail', async () => {
      mockedUserRepository.getGroupUsers.mockRejectedValue({
        message: 'Error test',
      });

      try {
        await service.getGroupUsers(ctx, groupId);
      } catch (error) {
        expect(error.message).toEqual('Error test');
      }
    });
  });

  describe('createGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;
    const createGroupInput: CreateGroupInput = {
      groupName: 'group name',
      companyName: 'company name',
      allowNonKomatsuInfoUse: true,
    };

    it('should throw BadRequestException if role template not found', async () => {
      mockedRepository.findOne.mockResolvedValue(null);
      mockUserGroupRoleTemplateRepository.getRoleTemplateManager.mockResolvedValue(
        null,
      );
      expect(
        service.createGroup(mockRequestContext, createGroupInput),
      ).rejects.toThrow('Role template not found.');
    });

    it('should create a group successfullly', async () => {
      const mockUserGroupRoleTemplate = new UserGroupRoleTemplate();
      mockUserGroupRoleTemplate.userGroupRoleTemplatePermissionAssignments = [
        createMock<UserGroupRoleTemplatePermissionAssignment>(),
      ];
      mockUserGroupRoleTemplate.userGroupRoleNameTranslations = [
        createMock<UserGroupRoleNameTranslation>(),
      ];
      mockedRepository.findOne.mockResolvedValue(null);
      mockUserGroupRoleTemplateRepository.getRoleTemplateManager.mockResolvedValue(
        mockUserGroupRoleTemplate,
      );

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
      const groupRepo: Group = mockDataSource.getRepository(Group);
      const groupHistoryRepo = mockDataSource.getRepository(GroupHistory);
      const userGroupAssignmentRepo =
        mockDataSource.getRepository(UserGroupAssignment);
      const userGroupPermissionRepo = mockDataSource.getRepository(
        UserGroupPermissionAssignment,
      );

      await service.createGroup(mockRequestContext, createGroupInput);

      expect(spyTransaction).toHaveBeenCalled();
      expect(groupRepo.save).toHaveBeenCalled();
      expect(groupHistoryRepo.insert).toHaveBeenCalled();
      expect(userGroupAssignmentRepo.insert).toHaveBeenCalled();
      expect(userGroupPermissionRepo.insert).toHaveBeenCalled();
    });
  });

  describe('getUserPermissionInGroup', () => {
    const params: GroupParam = { groupId: groupId };

    it('get user permission in group', async () => {
      const groupPermissions = {
        userId,
        groupId,
        userGroupPermissionAssignments: [
          {
            userId,
            groupId,
            permission: {
              operation: {
                operationCode: 'CREATE',
              },
              resource: {
                resourceCode: 'USER_GROUP_ASSIGNMENTS',
              },
            },
          },
        ],
      };
      const expectedOutput: PermissionInGroupOutput = {
        groupId: params.groupId,
        permissions: {
          USER_GROUP_ASSIGNMENTS: 'CREATE',
        },
        userId,
      };

      mockedUserGroupAssignmentRepository.getUserGroupAssignmentPermissions.mockResolvedValue(
        groupPermissions,
      );

      expect(await service.getUserPermissionInGroup(ctx, params)).toEqual(
        expectedOutput,
      );
    });

    it('get user permission in group ForbiddenException', async () => {
      mockedUserGroupAssignmentRepository.getUserGroupAssignmentPermissions.mockResolvedValue(
        undefined,
      );
      try {
        await service.getUserPermissionInGroup(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('deleteUserInGroup', () => {
    it('should throw error: User delete yourself', async () => {
      const params: GroupUserParam = {
        userId,
        groupId,
      };

      mockI18n.t.mockReturnValue('You cannot delete yourself.');

      try {
        await service.deleteUserInGroup(ctx, params);
      } catch (error) {
        expect(error.response.customMessage).toBe(
          'You cannot delete yourself.',
        );
        expect(mockI18n.t).toHaveBeenCalledWith(
          'message.group.deleteYourself',
          {
            lang: ctx.user.isoLocaleCode,
          },
        );
      }
    });

    it('should throw error: Already deleted.', async () => {
      const params: GroupUserParam = {
        userId: 'user01HD0E2GAANRQ80VJZVD3YX6',
        groupId,
      };
      const mockUser = {
        userId,
        userGroupAssignments: [
          {
            userId,
            groupId,
            currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
          },
        ],
      };
      mockedUserRepository.getUserGroupAssignment.mockResolvedValue(mockUser);
      mockI18n.t.mockReturnValue('Already deleted.');

      try {
        await service.deleteUserInGroup(ctx, params);
      } catch (error) {
        expect(error.response.customMessage).toBe('Already deleted.');
        expect(mockI18n.t).toHaveBeenCalledWith(
          'message.group.existingDelete',
          {
            lang: ctx.user.isoLocaleCode,
          },
        );
      }
    });

    it('should delete user in group success', async () => {
      const params: GroupUserParam = {
        userId: 'user01HD0E2GAANRQ80VJZVD3YX6',
        groupId,
      };
      const mockUser = {
        userId,
        currentStatus: UserCurrentStatus.CREATED,
        userGroupAssignments: [
          {
            userId,
            groupId,
          },
        ],
      };

      mockedUserRepository.getUserGroupAssignment.mockResolvedValue(mockUser);

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
      const userGroupAssignmentRepo: UserGroupAssignment =
        mockDataSource.getRepository(UserGroupAssignment);

      await service.deleteUserInGroup(ctx, params);

      expect(spyTransaction).toHaveBeenCalled();
      expect(userGroupAssignmentRepo.save).toHaveBeenCalled();
    });
  });

  describe('getUserPermissionInGroup', () => {
    const params: GroupParam = { groupId: groupId };

    it('get user permission in group', async () => {
      const groupPermissions = {
        userId,
        groupId,
        userGroupPermissionAssignments: [
          {
            userId,
            groupId,
            permission: {
              operation: {
                operationCode: 'CREATE',
              },
              resource: {
                resourceCode: 'USER_GROUP_ASSIGNMENTS',
              },
            },
          },
        ],
      };
      const expectedOutput: PermissionInGroupOutput = {
        groupId: params.groupId,
        permissions: {
          USER_GROUP_ASSIGNMENTS: 'CREATE',
        },
        userId,
      };

      mockedUserGroupAssignmentRepository.getUserGroupAssignmentPermissions.mockResolvedValue(
        groupPermissions,
      );

      expect(await service.getUserPermissionInGroup(ctx, params)).toEqual(
        expectedOutput,
      );
    });

    it('get user permission in group ForbiddenException', async () => {
      mockedUserGroupAssignmentRepository.getUserGroupAssignmentPermissions.mockResolvedValue(
        undefined,
      );
      try {
        await service.getUserPermissionInGroup(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('inviteUserToGroup', () => {
    const mockGroupParams: GroupParam = { groupId: groupId };
    const mockGroupInviteUserInput: GroupInviteUserInput = {
      inviteeUserId: 'inviteeUserE0SAVCGDC8DMP74E',
      isAdmin: false,
      userGroupRoleName: 'group role name',
      permissionIds: ['permissionE0SAVCGDC8DMP74E'],
      userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
    };

    it('Should error when permissionRepository.getPermissionByIds fail', async () => {
      mockPermissionRepository.getPermissionByIds.mockRejectedValue(
        new Error('Async error'),
      );

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('Async error');
    });

    it('Should error when check request permission fail', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([]);

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('PermissionId is invalid.');
    });

    it('Should error when userGroupRoleTemplateRepository.getTemplateRoleManager fail', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);

      mockUserGroupRoleTemplateRepository.getTemplateRoleManager.mockRejectedValue(
        new Error('Async error'),
      );

      mockGroupInviteUserInput.isAdmin = true;

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('Async error');
    });

    it('Should error when role template not exist', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);

      mockUserGroupRoleTemplateRepository.getTemplateRoleManager.mockResolvedValue(
        undefined,
      );

      mockGroupInviteUserInput.isAdmin = true;

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('UserGroupRoleTemplate manager is invalid.');
    });

    it('Should error when admin permissions invalid', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);

      mockUserGroupRoleTemplateRepository.getTemplateRoleManager.mockResolvedValue(
        {
          userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
          userGroupRoleNameTranslations: [{ roleName: 'group role name' }],
          userGroupRoleTemplatePermissionAssignments: [],
        },
      );

      mockGroupInviteUserInput.isAdmin = true;

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('Admin role information is invalid.');
    });

    it('Should error when userRepository.getUserInvitee fail', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);

      mockUserGroupRoleTemplateRepository.getTemplateRoleManager.mockResolvedValue(
        {
          userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
          userGroupRoleNameTranslations: [{ roleName: 'group role name' }],
          userGroupRoleTemplatePermissionAssignments: [
            'permissionE0SAVCGDC8DMP74E',
          ],
        },
      );

      mockedUserRepository.getUserInvitee.mockRejectedValue(
        new Error('Async error'),
      );

      mockGroupInviteUserInput.isAdmin = true;

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('Async error');
    });

    it('Should error when invite existing user but user not exists', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);
      mockedUserRepository.getUserInvitee.mockResolvedValue(undefined);
      mockGroupInviteUserInput.inviteeUserId = 'inviteeUserE0SAVCGDC8DMP74E';
      mockGroupInviteUserInput.isAdmin = false;

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('User not exist.');
    });

    it('Should error when invite existing user but user has been invited or is already in the group', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);
      mockedUserRepository.getUserInvitee.mockResolvedValue({
        userId: 'inviteeUserE0SAVCGDC8DMP74E',
        name: 'user name',
        groupInvitees: [{}],
        userGroupAssignments: [],
      });
      mockGroupInviteUserInput.inviteeUserId = 'inviteeUserE0SAVCGDC8DMP74E';
      mockGroupInviteUserInput.isAdmin = false;

      await expect(
        service.inviteUserToGroup(
          ctx,
          mockGroupParams,
          mockGroupInviteUserInput,
        ),
      ).rejects.toThrow('Bad Request Exception');

      expect(mockI18n.t).toHaveBeenCalledWith(
        'message.group.memberRegistered',
        {
          lang: ctx.user.isoLocaleCode,
        },
      );
    });

    it('Should invite existing user success', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);

      mockedUserRepository.getUserInvitee.mockReturnValue({
        userId: 'inviteeUserE0SAVCGDC8DMP74E',
        name: 'user name',
        groupInvitees: [],
        userGroupAssignments: [],
      });
      mockI18n.t.mockReturnValue('Invite existing user success');

      mockGroupInviteUserInput.inviteeUserId = 'inviteeUserE0SAVCGDC8DMP74E';
      mockGroupInviteUserInput.isAdmin = false;

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

      const groupInvitationRepo = mockDataSource.getRepository(GroupInvitation);
      const userGroupInvitationPermissionRepo = mockDataSource.getRepository(
        UserGroupPermissionInvitation,
      );
      const userGroupAssignmentRepo =
        mockDataSource.getRepository(UserGroupAssignment);
      const userGroupPermissionRepo = mockDataSource.getRepository(
        UserGroupPermissionAssignment,
      );

      const result = await service.inviteUserToGroup(
        ctx,
        mockGroupParams,
        mockGroupInviteUserInput,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(groupInvitationRepo.save).toHaveBeenCalled();
      expect(userGroupInvitationPermissionRepo.save).toHaveBeenCalled();
      expect(userGroupAssignmentRepo.insert).toHaveBeenCalled();
      expect(userGroupPermissionRepo.insert).toHaveBeenCalled();
      expect(result.meta).toEqual({
        successMessage: 'Invite existing user success',
      });
      expect(mockI18n.t).toHaveBeenCalledWith('message.group.inviteSuccess', {
        lang: ctx.user.isoLocaleCode,
      });
    });

    it('Should invite existing user success with isAdmin true', async () => {
      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);

      mockedUserRepository.getUserInvitee.mockReturnValue({
        userId: 'inviteeUserE0SAVCGDC8DMP74E',
        name: 'user name',
        groupInvitees: [],
        userGroupAssignments: [],
      });
      mockI18n.t.mockReturnValue('Invite existing user success');

      mockGroupInviteUserInput.inviteeUserId = 'inviteeUserE0SAVCGDC8DMP74E';
      mockGroupInviteUserInput.isAdmin = true;

      mockUserGroupRoleTemplateRepository.getTemplateRoleManager.mockResolvedValue(
        {
          userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
          userGroupRoleNameTranslations: [{ roleName: 'group role name' }],
          userGroupRoleTemplatePermissionAssignments: [
            'permissionE0SAVCGDC8DMP74E',
          ],
        },
      );

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

      const groupInvitationRepo = mockDataSource.getRepository(GroupInvitation);
      const userGroupInvitationPermissionRepo = mockDataSource.getRepository(
        UserGroupPermissionInvitation,
      );
      const userGroupAssignmentRepo =
        mockDataSource.getRepository(UserGroupAssignment);
      const userGroupPermissionRepo = mockDataSource.getRepository(
        UserGroupPermissionAssignment,
      );

      const result = await service.inviteUserToGroup(
        ctx,
        mockGroupParams,
        mockGroupInviteUserInput,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(groupInvitationRepo.save).toHaveBeenCalled();
      expect(userGroupInvitationPermissionRepo.save).toHaveBeenCalled();
      expect(userGroupAssignmentRepo.insert).toHaveBeenCalled();
      expect(userGroupPermissionRepo.insert).toHaveBeenCalled();
      expect(result.meta).toEqual({
        successMessage: 'Invite existing user success',
      });
      expect(mockI18n.t).toHaveBeenCalledWith('message.group.inviteSuccess', {
        lang: ctx.user.isoLocaleCode,
      });
    });
  });

  describe('updateArchiveStatusUserGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;
    const mockResult: BaseApiResponse<object> = {
      data: {},
      meta: {
        successMessage: 'The group has been archived.',
      },
    };
    const body: GroupsUserArchiveStatusInput = {
      isArchived: true,
      groupIds: ['groupE2D3DE0SAVCGDC8DMP74E'],
    };

    it('should throw BadRequestException if groupIds is invalid', async () => {
      const mockListGroupByIds = [];

      jest
        .spyOn(mockedRepository, 'getListGroupByIds')
        .mockReturnValue(mockListGroupByIds);

      try {
        await service.updateArchiveStatusUserGroup(mockRequestContext, body);
      } catch (error) {
        expect(error.message).toBe(
          'The groupId list contains invalid groupId.',
        );
      }
    });

    it('should throw BadRequestException if group exist deleted', async () => {
      const mockListGroupByIds = [
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          groupName: 'mock group name',
          location: 'mock location',
          currentStatus: 'DELETED',
          lastStatusUpdatedAt: '2023-11-20T02:48:26.000Z',
        },
      ];

      jest
        .spyOn(mockedRepository, 'getListGroupByIds')
        .mockReturnValue(mockListGroupByIds);

      try {
        await service.updateArchiveStatusUserGroup(mockRequestContext, body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw ForbiddenException if user not assigned in group', async () => {
      const mockListGroupByIds = [
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          groupName: 'mock group name',
          location: 'mock location',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2023-11-20T02:48:26.000Z',
          userGroupAssignments: [],
        },
      ];

      jest
        .spyOn(mockedRepository, 'getListGroupByIds')
        .mockReturnValue(mockListGroupByIds);

      try {
        await service.updateArchiveStatusUserGroup(mockRequestContext, body);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should throw Error if userGroupSettingRepository.update: error', async () => {
      const mockGroup = [
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          userId: 'userYE1S2NCG2HXHP4R35R6J0N',
          currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
        },
      ];
      mockedUserGroupAssignmentRepository.find.mockResolvedValue(mockGroup);
      mockUserGroupSettingRepository.update.mockRejectedValue(new Error());

      try {
        await service.updateArchiveStatusUserGroup(mockRequestContext, body);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('updateArchiveStatusUserGroup success', async () => {
      const mockListGroupByIds = [
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          groupName: 'mock group name',
          location: 'mock location',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2023-11-20T02:48:26.000Z',
          userGroupAssignments: [
            {
              groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
              userId,
              currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
            },
          ],
        },
      ];

      jest
        .spyOn(mockedRepository, 'getListGroupByIds')
        .mockReturnValue(mockListGroupByIds);
      mockUserGroupSettingRepository.update.mockReturnThis();
      mockI18n.t.mockReturnValue('The group has been archived.');

      const result = await service.updateArchiveStatusUserGroup(
        mockRequestContext,
        body,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getGroupCandidateUsers', () => {
    const mockParam: GroupParam = {
      groupId: groupId,
    };

    const mockQuery: GroupCandidateUserQuery = {
      search: 'mockEmail@gmail.com',
    };

    it('should return list candidate user when getGroupCandidateUsers success', async () => {
      const mockGroupCandidateUserOutput = [
        {
          userId: 'userIdUL38H3YKK67HSY2VH457',
          surname: 'mock surname',
          givenName: 'mock given name',
          email: 'mockEmail@gmail.com',
          pictureUrl: '/mypicture?sas=1234567890',
          searchId: '0000123',
        },
      ];

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockGroupCandidateUserOutput[0].pictureUrl,
      );

      jest
        .spyOn(mockedUserRepository, 'getGroupCandidateUserBySearch')
        .mockReturnValue(mockGroupCandidateUserOutput);

      const result = await service.getGroupCandidateUsers(
        ctx,
        mockParam.groupId,
        mockQuery.search,
      );

      expect(result).toEqual(mockGroupCandidateUserOutput);
    });

    it('should return error when getGroupCandidateUsers service fail', async () => {
      jest
        .spyOn(mockedUserRepository, 'getGroupCandidateUserBySearch')
        .mockRejectedValue({ message: 'Test error' });

      try {
        await service.getGroupCandidateUsers(
          ctx,
          mockParam.groupId,
          mockQuery.search,
        );
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('updateUserGroupAssignment', () => {
    const params: GroupUserParam = {
      userId,
      groupId,
    };

    it('Should update user info group assignment success', async () => {
      const body: UserGroupAssignmentUpdateInput = {
        isAdmin: false,
        userGroupRoleName: 'roleName',
        permissionIds: ['permissionE0SAVCGDC8DMP74E'],
        userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
      };
      const mockUser = {
        userId,
        currentStatus: UserCurrentStatus.CREATED,
        userGroupAssignments: [
          {
            userId,
            groupId,
          },
        ],
      };
      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      jest
        .spyOn(mockedUserRepository, 'getUserGroupAssignment')
        .mockResolvedValue(mockUser);

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const userGroupAssignmentRepo: UserGroupAssignment =
        mockDataSource.getRepository(UserGroupAssignment);
      const userGroupPermissionRepo: UserGroupPermissionAssignment =
        mockDataSource.getRepository(UserGroupPermissionAssignment);

      mockPermissionRepository.getPermissionByIds.mockResolvedValue([
        'permissionE0SAVCGDC8DMP74E',
      ]);
      await service.updateUserGroupAssignment(ctx, params, body);
      expect(spyTransaction).toHaveBeenCalled();
      expect(userGroupAssignmentRepo.save).toHaveBeenCalled();
      expect(userGroupPermissionRepo.save).toHaveBeenCalled();
    });
  });

  describe('getUserAssignmentInfo', () => {
    const params: GroupUserParam = {
      userId,
      groupId,
    };

    it('should user assignment info in group successfully', async () => {
      const mockUser = {
        userId: userId,
        givenName: 'given name',
        surname: 'surname',
        userGroupAssignments: [
          {
            userGroupRoleName: 'role name',
            isAdmin: false,
            userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
          },
        ],
      };
      const mockUserAssignmentInfo = [
        {
          userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
          roleCode: 'role code 1',
          isAdmin: false,
          userGroupRoleTemplatePermissionAssignments: [
            {
              permissionId: 'permission065BDR71D53H2ZBB',
              userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
              permission: {
                permissionId: 'permission065BDR71D53H2ZBB',
                resourceId: 'resourse5G14M29P07VHX8EWBP4',
                operationId: 'opreationZV2KJHBD0WT6T33NQ8',
                permissionTranslations: [
                  {
                    permissionId: 'permission065BDR71D53H2ZBB',
                    isoLocaleCode: ISOLocaleCode.JA,
                    permissionName: 'permission name',
                  },
                ],
                userGroupPermissionAssignments: [
                  {
                    userId,
                    groupId,
                  },
                ],
              },
            },
          ],
        },
      ];
      const mockResponse: UserAssignmentInfoOutput = {
        userId: userId,
        givenName: 'given name',
        surname: 'surname',
        groupId: groupId,
        roleName: 'role name',
        permissions: [
          {
            isChecked: true,
            permissionId: 'permission065BDR71D53H2ZBB',
            isoLocaleCode: ISOLocaleCode.JA,
            permissionName: 'permission name',
          },
        ],
        isAdmin: false,
        userGroupRoleTemplateId: 'role065BDMT6RRTEF1A989H6AV',
      };

      mockedUserRepository.getUserGroupAssignment.mockReturnValue(mockUser);
      mockUserGroupRoleTemplateRepository.getUserAssignmentInfo.mockReturnValue(
        mockUserAssignmentInfo,
      );

      const response = await service.getUserAssignmentInfo(ctx, params);

      expect(response).toEqual(mockResponse);
    });
  });

  describe('deleteGroups', () => {
    it('should return message delete group success when deleteGroups service success', async () => {
      const mockInput: DeleteGroupsInput = {
        groupIds: ['065D212J34D8MAJ2SZZHN32ZB0'],
      };
      const mockListGroupByIds = [
        {
          groupId: '065D212J34D8MAJ2SZZHN32ZB0',
          groupName: 'mock group name',
          location: 'mock location',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2023-11-20T02:48:26.000Z',
          userGroupAssignments: [
            {
              groupId: '065D212J34D8MAJ2SZZHN32ZB0',
              userId,
              currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
            },
          ],
        },
      ];
      const mockgGetGroupPermission = [
        {
          groupId: '065D212J34D8MAJ2SZZHN32ZB0',
          groupName: 'mock group name',
          location: 'mock location',
          currentStatus: 'CREATED',
          lastStatusUpdatedAt: '2023-11-20T02:48:26.000Z',
        },
      ];

      jest
        .spyOn(mockedRepository, 'getListGroupByIds')
        .mockReturnValue(mockListGroupByIds);

      jest
        .spyOn(mockedUserGroupAssignmentRepository, 'getUserPermissionInGroups')
        .mockReturnValue(mockgGetGroupPermission);

      const mockDataSource = {
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
        update: jest.fn(() => new UpdateResult()),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const groupRepo = mockDataSource.getRepository(Group);
      const userGroupAssignmentRepo =
        mockDataSource.getRepository(UserGroupAssignment);

      await service.deleteGroups(ctx, mockInput.groupIds);

      expect(spyTransaction).toHaveBeenCalled();
      expect(groupRepo.update).toHaveBeenCalled();
      expect(userGroupAssignmentRepo.update).toHaveBeenCalled();
    });

    it('should return error when deleteGroups service fail', async () => {
      const mockListGroupByIds = [
        {
          groupId: '065D212J34D8MAJ2SZZHN32ZB0',
          groupName: 'mock group name',
          location: 'mock location',
          currentStatus: 'DELETED',
          lastStatusUpdatedAt: '2023-11-20T02:48:26.000Z',
        },
      ];
      const mockInput: DeleteGroupsInput = {
        groupIds: [mockListGroupByIds[0].groupId],
      };

      jest
        .spyOn(mockedRepository, 'getListGroupByIds')
        .mockReturnValue(mockListGroupByIds);

      mockI18n.t.mockReturnValue('Already deleted.');

      try {
        await service.deleteGroups(ctx, mockInput.groupIds);
      } catch (error) {
        expect(error.response.customMessage).toEqual('Already deleted.');
      }
    });
  });

  describe('updateGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const mockUpdateGroupInput: UpdateGroupInput = {
      groupName: 'mock group name',
      location: 'mock location',
      companyName: 'company name',
      allowNonKomatsuInfoUse: true,
    };
    const mockGroupContext = new Group();

    it('should throw error when save error', async () => {
      mockedRepository.findOne.mockReturnValue(null);
      mockedRepository.save.mockRejectedValue({ message: 'Error test' });

      try {
        await service.updateGroup(
          mockRequestContext,
          groupId,
          mockUpdateGroupInput,
          mockGroupContext,
        );
      } catch (error) {
        expect(error.message).toBe('Error test');
      }
    });

    it('should group was updated successfully', async () => {
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
      const groupRepo = mockDataSource.getRepository(Group);
      const groupHistoryRepo = mockDataSource.getRepository(GroupHistory);

      await service.updateGroup(
        mockRequestContext,
        groupId,
        mockUpdateGroupInput,
        mockGroupContext,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(groupRepo.update).toHaveBeenCalled();
      expect(groupHistoryRepo.insert).toHaveBeenCalled();
    });
  });

  describe('updateMachineFavoriteStatus', () => {
    const params: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    it('should throw NotFoundException if machine not found', async () => {
      mockMachineRepository.findOne.mockReturnValue(null);

      try {
        await service.updateMachineFavoriteStatus(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Machine not found.');
      }
    });

    it('should throw NotFoundException if machine deleted', async () => {
      const mockMachine = {
        machineId: 'machineX6ZDP4HXM46349GPASD',
        currentStatus: MachineCurrentStatus.DELETED,
      };

      mockMachineRepository.findOne.mockReturnValue(mockMachine);

      try {
        await service.updateMachineFavoriteStatus(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Machine not found.');
      }
    });

    it('should return CREATED status when updating favorite status successfully', async () => {
      const mockMachine = {
        machineId: 'machineJX6ZDP4HXM46349GPASD',
        machineName: 'machine name',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'DFSEFRE',
        serialNumber: '10',
        serialNumberPlatePictureUrl: 'https://picsum.photos/id/1/200/200',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: new Date(),
      };
      mockMachineRepository.findOne.mockReturnValue(mockMachine);

      const mockDataSource = {
        delete: jest.fn(),
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const userGroupMachineFavoriteRepo = mockDataSource.getRepository(
        UserGroupMachineFavorite,
      );
      jest
        .spyOn(userGroupMachineFavoriteRepo, 'delete')
        .mockReturnValue({ affected: 0 });

      await service.updateMachineFavoriteStatus(ctx, params);

      expect(spyTransaction).toHaveBeenCalled();
      expect(userGroupMachineFavoriteRepo.delete).toHaveBeenCalled();
      expect(userGroupMachineFavoriteRepo.insert).toHaveBeenCalled();
    });

    it('should return DELETED status when updating un-favorite status successfully', async () => {
      const mockOutput: MachineFavoriteOutput = {
        status: MachineFavoriteResponse.DELETED,
      };
      const mockMachine = {
        machineId: 'machineJX6ZDP4HXM46349GPASD',
        machineName: 'machine name',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
        modelAndType: 'DFSEFRE',
        serialNumber: '10',
        serialNumberPlatePictureUrl: 'https://picsum.photos/id/1/200/200',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: new Date(),
      };
      mockMachineRepository.findOne.mockReturnValue(mockMachine);
      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      mockDataSource.getRepository(
        new BadRequestException('Bad request error'),
      );
      const userGroupMachineFavoriteRepo = mockDataSource.getRepository(
        UserGroupMachineFavorite,
      );
      jest
        .spyOn(userGroupMachineFavoriteRepo, 'delete')
        .mockReturnValue({ affected: 1 });

      const result = await service.updateMachineFavoriteStatus(ctx, params);

      expect(spyTransaction).toHaveBeenCalled();
      expect(userGroupMachineFavoriteRepo.delete).toHaveBeenCalled();
      expect(result).toEqual(mockOutput);
    });
  });

  describe('getGroupDetailInfo', () => {
    const params: GroupParam = {
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    it('should throw NotFoundException when group not found with the specified groupId.', async () => {
      mockedRepository.getGroupDetailById.mockReturnValue(null);

      try {
        await service.getGroupDetailInfo(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(
          'Group not found with the specified groupId.',
        );
      }
    });

    it('should return group detail info', async () => {
      const mockOutput: GroupDetailInfoOutput = {
        groupId: 'group01HD0E2GAANRQ80VJZVD3S',
        groupName: 'group name',
        location: 'location',
        currentStatus: GroupCurrentStatus.CREATED,
        lastStatusUpdatedAt: new Date(),
        isArchived: false,
        companyName: 'company name',
        allowNonKomatsuInfoUse: true,
      };

      mockedRepository.getGroupDetailById.mockReturnValue(mockOutput);

      const result = await service.getGroupDetailInfo(ctx, params);

      expect(result).toEqual(mockOutput);
    });
  });

  describe('getMachinesInGroup', () => {
    const mockGroupId: GroupParam = { groupId: groupId };
    it('get list machines in group success', async () => {
      const mockMachines = [
        {
          machineId: 'machineS2NCG2HXHP4R35R6J0N',
          modelAndType: 'model and type',
          machineName: 'machine name',
          machineManufacturerName: 'manufacturer name',
          pictureUrl: 'url',
          groupMachineCondition: {
            machineCondition: GroupMachineCondition.NORMAL,
          },
        },
      ];

      const mockResult = {
        favoriteMachines: [],

        unFavoriteMachines: [
          {
            machineId: 'machineS2NCG2HXHP4R35R6J0N',
            machineName: 'machine name',
            modelAndType: 'model and type',
            machineManufacturerName: 'manufacturer name',
            pictureUrl: 'url',
            machineReportCount: 0,
            machineCondition: GroupMachineCondition.NORMAL,
            isFavorite: false,
          },
        ],
      };

      mockMachineRepository.countMachineReport.mockReturnValue([]);

      mockMachineRepository.getMachinesInGroup.mockResolvedValue(mockMachines);
      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResult),
      });

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockMachines[0].pictureUrl,
      );

      expect(await service.getMachinesInGroup(ctx, mockGroupId)).toEqual(
        mockResult,
      );
    });

    it('machineRepository.getMachinesInGroup error', async () => {
      mockMachineRepository.countMachineReport.mockReturnValue([]);
      mockMachineRepository.getMachinesInGroup.mockRejectedValue(new Error());
      try {
        await service.getMachinesInGroup(ctx, mockGroupId);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('assignMachineIntoGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;
    const mockGroupId: GroupParam = { groupId: groupId };
    const body: MachinesAssignIntoGroupInput = {
      machineIds: ['machineS2NCG2HXHP4R35R6J0N'],
    };

    it('should throw BadRequestException if machineIds is invalid', async () => {
      const mockListMachineByIds = [];

      jest
        .spyOn(mockMachineRepository, 'getMachinesByMachineIds')
        .mockReturnValue(mockListMachineByIds);

      try {
        await service.assignMachineIntoGroup(
          mockRequestContext,
          mockGroupId,
          body,
        );
      } catch (error) {
        expect(error.message).toBe(
          'The machineId list contains invalid machineId.',
        );
      }
    });

    it('should throw BadRequestException if machine exist deleted', async () => {
      const mockListMachineByIds = [
        {
          machineId: 'machineS2NCG2HXHP4R35R6J0N',
          currentStatus: 'DELETED',
        },
      ];

      jest
        .spyOn(mockMachineRepository, 'getMachinesByMachineIds')
        .mockReturnValue(mockListMachineByIds);

      try {
        await service.assignMachineIntoGroup(
          mockRequestContext,
          mockGroupId,
          body,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('assignMachineIntoGroup success', async () => {
      const mockListMachineByIds = [
        {
          machineId: 'machineS2NCG2HXHP4R35R6J0N',
          groupMachineAssignments: [],
        },
      ];

      const mockResult: BaseApiResponse<object> = {
        data: {},
        meta: {
          successMessage: 'Already deleted.',
        },
      };

      jest
        .spyOn(mockMachineRepository, 'getMachinesByMachineIds')
        .mockReturnValue(mockListMachineByIds);

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
      const machineRepo = mockDataSource.getRepository(Machine);
      mockI18n.t.mockReturnValue('Already deleted.');

      const result = await service.assignMachineIntoGroup(
        mockRequestContext,
        mockGroupId,
        body,
      );

      expect(result).toEqual(mockResult);
      expect(spyTransaction).toHaveBeenCalled();
      expect(machineRepo.save).toHaveBeenCalled();
    });

    it('assignMachineIntoGroup error: same ModelAndType and SerialNumber', async () => {
      const body: MachinesAssignIntoGroupInput = {
        machineIds: [
          'machineS2NCG2HXHP4R35R6J0N',
          '01HNCR3ZKH9S7NNWE6HGNW1GVY',
          '01HNCR9ETHCFXDW2P2VMBCGZKA',
        ],
      };
      const mockListMachineByIds = [
        {
          machineId: 'machineS2NCG2HXHP4R35R6J0N',
          groupMachineAssignments: [],
        },
        {
          machineId: '01HNCR3ZKH9S7NNWE6HGNW1GVY',
          groupMachineAssignments: [],
        },
        {
          machineId: '01HNCR9ETHCFXDW2P2VMBCGZKA',
          groupMachineAssignments: [],
        },
      ];

      jest
        .spyOn(mockMachineRepository, 'getMachinesByMachineIds')
        .mockReturnValue(mockListMachineByIds);

      mockI18n.t.mockReturnValue(
        'Some machines that has the same type-model and model number as the selected machines have already been added.',
      );

      try {
        await service.assignMachineIntoGroup(
          mockRequestContext,
          mockGroupId,
          body,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getMachineDetailInfo', () => {
    const params: GroupMachineParam = {
      machineId: 'machine01HD0E2GANRQ80VJZDE',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    it('should return machine detail info', async () => {
      jest.mock('class-transformer');
      const mockMachineDetail = {
        machineId: params.machineId,
        machineName: 'machine name',
        pictureUrl: '/mypicture?sas=1234567890',
        modelAndType: 'model',
        serialNumber: '10',
        serialNumberPlatePictureUrl: '/mypicture?sas=1234567890',
        machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
        machineManufacturerId: 'manufacturerH5EB1NXCFDF4ZTMG',
        groupMachineCondition: {
          machineCondition: 'NORMAL',
        },
        machineType: {
          machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
          machineTypeCode: 'HE',
          pictureUrl: 'machine_types/crawler_excavator_default.jpg',
          machineTypeTranslation: {
            machineTypeId: params.machineId,
            isoLocaleCode: 'en',
            typeName: 'type name',
          },
        },
        machineManufacturer: {
          machineManufacturerId: 'manufacturerH5EB1NXCFDF4ZTMG',
          machineManufacturerName: 'manufacturer name',
        },
        userGroupMachineFavorites: [
          {
            userId: userId,
            groupId: params.groupId,
            machineId: params.machineId,
          },
        ],
      };

      mockMachineRepository.getMachineDetailInfo.mockReturnValue(
        mockMachineDetail,
      );

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockMachineDetail.pictureUrl,
      );

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockMachineDetail.serialNumberPlatePictureUrl,
      );

      const mockResult = {
        ...mockMachineDetail,
        machineTypeName:
          mockMachineDetail.machineType.machineTypeTranslation.typeName,
        isFavorite: !!mockMachineDetail.userGroupMachineFavorites.length,
        machineManufacturerName:
          mockMachineDetail.machineManufacturer.machineManufacturerName,
        machineCondition:
          mockMachineDetail.groupMachineCondition.machineCondition,
        filePath: mockMachineDetail.pictureUrl,
        serialNumberFilePath: mockMachineDetail.serialNumberPlatePictureUrl,
      };
      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(mockResult),
      });

      const result = await service.getMachineDetailInfo(ctx, params);

      expect(result).toEqual(mockResult);
    });
  });

  describe('createMachineInGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;
    mockRequestContext.isoLocaleCode = ISOLocaleCode.EN;
    const mockParam = new GroupParam();
    mockParam.groupId = groupId;

    const mockMachineInput: MachineInput = {
      machineName: 'mock machine name',
      machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      machineManufacturerId: 'machineManufacturerId6J0NG',
      modelAndType: 'model and type',
      serialNumber: 'serial number',
      serialNumberPlatePictureUrl: 'https://picserial.photos/id/1/200/200',
      customTypeName: null,
      customMachineManufacturerName: null,
    };

    const mockMachineTypeOutput = {
      machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
      machineTypeCode: 'machine type code',
      typeName: 'type name',
      pictureUrl: 'https://pictype.photos/id/1/200/200',
    };

    const mockMachineManufacturerOutput = {
      machineManufacturerId: 'machineManufactureId4R35R6',
      machineManufacturerName: 'machine manufacture name',
    };

    it('should throw BadRequestException when machineManufacturerId not in database', async () => {
      mockMachineRepository.getMachineInGroup.mockReturnValue(null);
      mockMachineManufacturerRepository.findOne.mockResolvedValue(null);
      mockMachineTypeRepository.findOne.mockResolvedValue(
        mockMachineTypeOutput,
      );

      try {
        await service.createMachineInGroup(
          mockRequestContext,
          mockParam,
          mockMachineInput,
        );
      } catch (error) {
        expect(error.message).toBe('Machine manufacturer ID invalid.');
        expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw BadRequestException when machineManufacturerId not in database', async () => {
      mockMachineRepository.getMachineInGroup.mockReturnValue(null);
      mockMachineManufacturerRepository.findOne.mockResolvedValue(
        mockMachineManufacturerOutput,
      );
      mockMachineTypeRepository.findOne.mockResolvedValue(null);

      try {
        await service.createMachineInGroup(
          mockRequestContext,
          mockParam,
          mockMachineInput,
        );
      } catch (error) {
        expect(error.message).toBe('Machine type ID invalid.');
        expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw BadRequestException when machine already exist in group', async () => {
      const mockMachine = {
        machineId: 'machineIdCJ5KT71EJR6DJGTZH',
        machineName: 'machine name',
        machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
        pictureUrl: '',
        machineManufacturerId: 'machineManufacturerId6J0NG',
        modelAndType: 'model2',
        serialNumber: 'serial number',
        serialNumberPlatePictureUrl: '',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2023-12-06T07:28:59.000Z',
      };

      mockMachineRepository.getMachineInGroup.mockReturnValue(mockMachine);
      mockMachineManufacturerRepository.findOne.mockResolvedValue(
        mockMachineManufacturerOutput,
      );
      mockMachineTypeRepository.findOne.mockResolvedValue(
        mockMachineTypeOutput,
      );

      mockI18n.t.mockReturnValue('This machine is already registered.');

      try {
        await service.createMachineInGroup(
          mockRequestContext,
          mockParam,
          mockMachineInput,
        );
      } catch (error) {
        expect(error.response.customMessage).toBe(
          'This machine is already registered.',
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw BadRequestException when serial number exceeds the maximum length.', async () => {
      const mockMachineManufacturer = {
        machineManufacturerId: 'machineManufactureId4R35R6',
        machineManufacturerName: MACHINE_MANUFACTURER_KMT,
      };
      const mockMachineType = {
        machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
        machineTypeCode: 'MACHINE_TYPE_CODE_CUSTOM',
        typeName: 'type name',
        pictureUrl: 'https://pictype.photos/id/1/200/200',
      };
      const validationContent = {
        serialNumber: [
          {
            manufacturer: 'machineManufactureId4R35R6',
            machineType: 'OTHER_MACHINE_TYPES',
            regex:
              '^(([0-9]+)|((A|B|C|N|J|K|H|F|Y|NL)[0-9]+)|((DB|DZ)[a-zA-Z0-9]+))$',
            message: {
              ja: 'Message for jp language',
              en: 'Message for the English language',
            },
            maxLength: 8,
            uppercase: true,
          },
        ],
      };

      mockMachineRepository.getMachineInGroup.mockReturnValue(null);
      mockMachineManufacturerRepository.findOne.mockReturnValue(
        mockMachineManufacturer,
      );
      mockMachineTypeRepository.findOne.mockReturnValue(mockMachineType);
      mockBlobStorageFileService.getFileContent.mockReturnValue(
        validationContent,
      );

      const mockJsonParse = jest.spyOn(JSON, 'parse');
      mockJsonParse.mockImplementation(() => validationContent);

      await expect(
        service.createMachineInGroup(
          mockRequestContext,
          mockParam,
          mockMachineInput,
        ),
      ).rejects.toThrow('The serial number exceeds the maximum length.');
    });

    it('should throw BadRequestException when serial number valid', async () => {
      const mockMachineManufacturer = {
        machineManufacturerId: 'machineManufactureId4R35R6',
        machineManufacturerName: MACHINE_MANUFACTURER_KMT,
      };
      const mockMachineType = {
        machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
        machineTypeCode: 'MACHINE_TYPE_CODE_CUSTOM',
        typeName: 'type name',
        pictureUrl: 'https://pictype.photos/id/1/200/200',
      };
      const mockMachineInput: MachineInput = {
        machineName: 'mock machine name',
        machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        machineManufacturerId: 'machineManufacturerId6J0NG',
        modelAndType: 'model and type',
        serialNumber: 'DB',
        serialNumberPlatePictureUrl: 'https://picserial.photos/id/1/200/200',
        customTypeName: null,
        customMachineManufacturerName: null,
      };

      mockMachineRepository.getMachineInGroup.mockReturnValue(null);
      mockMachineManufacturerRepository.findOne.mockReturnValue(
        mockMachineManufacturer,
      );
      mockMachineTypeRepository.findOne.mockReturnValue(mockMachineType);

      const validationContent = {
        serialNumber: [
          {
            manufacturer: 'machineManufactureId4R35R6',
            machineType: 'OTHER_MACHINE_TYPES',
            regex:
              '^(([0-9]+)|((A|B|C|N|J|K|H|F|Y|NL)[0-9]+)|((DB|DZ)[a-zA-Z0-9]+))$',
            message: {
              ja: 'Message for jp language',
              en: 'Message for the English language',
            },
            maxLength: 8,
            uppercase: true,
          },
        ],
      };
      mockBlobStorageFileService.getFileContent.mockReturnValue(
        validationContent,
      );

      const mockJsonParse = jest.spyOn(JSON, 'parse');
      mockJsonParse.mockImplementation(() => validationContent);

      try {
        await service.createMachineInGroup(
          mockRequestContext,
          mockParam,
          mockMachineInput,
        );
      } catch (error) {
        expect(error.response.customMessage).toBe(
          'Message for the English language',
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should machine was created successfully', async () => {
      const mockMachineInput: MachineInput = {
        machineName: 'mock machine name',
        machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        machineManufacturerId: 'machineManufacturerId6J0NG',
        modelAndType: 'model and type',
        serialNumber: 'string',
        serialNumberPlatePictureUrl: 'https://picserial.photos/id/1/200/200',
        customTypeName: null,
        customMachineManufacturerName: null,
      };
      const mockMachineManufacturerOutput = {
        machineManufacturerId: 'machineManufactureId4R35R6',
        machineManufacturerName: 'machine manufacture name',
      };
      const mockMachineTypeOutput = {
        machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
        machineTypeCode: 'machine type code',
        typeName: 'type name',
        pictureUrl: 'https://pictype.photos/id/1/200/200',
      };

      mockMachineRepository.getMachineInGroup.mockReturnValue(null);

      mockMachineManufacturerRepository.findOne.mockResolvedValue(
        mockMachineManufacturerOutput,
      );
      mockMachineTypeRepository.findOne.mockResolvedValue(
        mockMachineTypeOutput,
      );

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
      const machineRepo: Machine = mockDataSource.getRepository(Machine);
      const machineHistoryRepo: MachineHistory =
        mockDataSource.getRepository(MachineHistory);
      const machineConditionRepo =
        mockDataSource.getRepository(MachineCondition);
      const machineConditionHistoryRepo = mockDataSource.getRepository(
        MachineConditionHistory,
      );
      const validationContent = {
        serialNumber: [
          {
            __comment__: 'In case update for other manufacturers',
            manufacturer: 'OTHER_MACHINE_MANUFACTURERS',
            machineType: 'ALL_MACHINE_TYPES',
            __regexComment__:
              'Character type: half-width alphabet (include number)',
            regex: '^[a-zA-Z0-9]+$',
            message: {
              ja: 'Message for jp language',
              en: 'Message for the English language',
            },
            maxLength: 20,
            uppercase: false,
          },
        ],
      };
      mockBlobStorageFileService.getFileContent.mockReturnValue(
        validationContent,
      );

      const mockJsonParse = jest.spyOn(JSON, 'parse');
      mockJsonParse.mockImplementation(() => validationContent);

      await service.createMachineInGroup(
        mockRequestContext,
        mockParam,
        mockMachineInput,
      );

      expect(spyTransaction).toBeCalledTimes(1);
      expect(machineRepo.save).toBeCalledTimes(1);
      expect(machineHistoryRepo.save).toBeCalledTimes(1);
      expect(machineConditionRepo.insert).toBeCalledTimes(1);
      expect(machineConditionHistoryRepo.insert).toBeCalledTimes(1);
    });
  });

  describe('getGroupAvailableMachines', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';

    const params: GroupParam = {
      groupId,
    };

    it('should get list suggestion machine success', async () => {
      const mockGroupAvailableMachineOutput = [
        {
          machineId: 'machineIdN9Q0KYA36EJ6PR7W7',
          machineName: 'machine name',
          pictureUrl: 'https://picsum.photos/id/1/200/200',
          modelAndType: 'model',
        },
      ];
      const query: GroupAvailableMachineQuery = {
        search: undefined,
      };

      mockMachineRepository.groupMachineSuggestions.mockReturnValue(
        mockGroupAvailableMachineOutput,
      );

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        mockGroupAvailableMachineOutput[0].pictureUrl,
      );

      expect(
        await service.getGroupAvailableMachines(
          mockRequestContext,
          params.groupId,
          query.search,
        ),
      ).toEqual(
        plainToInstance(
          GroupAvailableMachineOutput,
          mockGroupAvailableMachineOutput,
          {
            excludeExtraneousValues: true,
          },
        ),
      );
    });

    it('should return test error when machineRepository.groupMachineSuggestions fail', async () => {
      const query: GroupAvailableMachineQuery = {
        search: 'machine name',
      };

      mockMachineRepository.groupMachineSuggestions.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await service.getGroupAvailableMachines(
          mockRequestContext,
          params.groupId,
          query.search,
        );
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('updateMachineInGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const mockUpdateMachineInGroupInput: UpdateMachineInGroupInput = {
      machineName: 'mock machine name',
      machineTypeId: 'machineTypeIdXHP4R35R6J0NG',
      pictureUrl: 'https://picsum.photos/id/1/200/200',
      machineManufacturerId: 'machineManufacturerId6J0NG',
      modelAndType: 'model and type',
      serialNumber: 'serialnumber',
      serialNumberPlatePictureUrl: 'https://picserial.photos/id/1/200/200',
      customTypeName: null,
      customMachineManufacturerName: null,
    };

    it('should throw BadRequestException when machineManufacturerId not in database', async () => {
      const mockMachineType = {
        machineTypeId: '01HCC6APNVP6KQVFZG8VRNC0Z3',
        machineTypeCode: 'test',
        pictureUrl: 'test',
      };
      const mockCheckMachineExist = [];

      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(mockCheckMachineExist);

      const mockService = {
        checkMachineRelations: jest.fn(),
      };

      mockService.checkMachineRelations.mockReturnValue(mockMachineType);

      try {
        await service.updateMachineInGroup(
          mockRequestContext,
          mockParams,
          mockUpdateMachineInGroupInput,
        );
      } catch (error) {
        expect(error.message).toBe('Machine manufacturer ID invalid.');
        expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should machine was updated successfully', async () => {
      const mockMachine = {
        machineId: 'machine01HD0E2GAANRQ80VJZDEW',
        machineName: 'machine name',
        machineTypeId: 'machineTypeNVP6KQVFZG8VRNC',
        pictureUrl: '',
        machineManufacturerId: 'machineManufacturerVFZG8VR',
        modelAndType: 'model',
        serialNumber: 'string',
        serialNumberPlatePictureUrl: '',
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2023-11-30T04:21:46.000Z',
      };
      const mockMachineType = {
        machineTypeId: '01HCC6APNVP6KQVFZG8VRNC0Z3',
        machineTypeCode: 'test',
        pictureUrl: 'test',
      };
      const mockMachineManufacturer = {
        machineManufacturerId: 'machineManufactureId4R35R6',
        machineManufacturerName: 'machine manufacture name',
      };
      mockMachineManufacturerRepository.findOne.mockResolvedValue(
        mockMachineManufacturer,
      );
      mockMachineRepository.getMachineInGroupById.mockReturnValue(mockMachine);
      mockMachineRepository.getMachineInGroup.mockReturnValue(mockMachine);
      mockMachineTypeRepository.findOne.mockReturnValue(mockMachineType);

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
      const machineRepo = mockDataSource.getRepository(Machine);
      const machineHistoryRepo = mockDataSource.getRepository(MachineHistory);

      const validationContent = {
        serialNumber: [
          {
            __comment__: 'In case update for other manufacturers',
            manufacturer: 'OTHER_MACHINE_MANUFACTURERS',
            machineType: 'ALL_MACHINE_TYPES',
            __regexComment__:
              'Character type: half-width alphabet (include number)',
            regex: '^[a-zA-Z0-9]+$',
            message: {
              ja: 'Message for jp language',
              en: 'Message for the English language',
            },
            maxLength: 20,
            uppercase: false,
          },
        ],
      };
      mockBlobStorageFileService.getFileContent.mockReturnValue(
        validationContent,
      );

      const mockJsonParse = jest.spyOn(JSON, 'parse');
      mockJsonParse.mockImplementation(() => validationContent);

      await service.updateMachineInGroup(
        mockRequestContext,
        mockParams,
        mockUpdateMachineInGroupInput,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineRepo.create).toHaveBeenCalled();
      expect(machineRepo.update).toHaveBeenCalled();
      expect(machineHistoryRepo.insert).toHaveBeenCalled();
    });
  });

  describe('updateMachineConditionStatus', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const mockUpdateMachineConditionInput: UpdateMachineConditionInput = {
      machineCondition: GroupMachineCondition.NORMAL,
    };

    it('should throw NotFoundException when machine not found', async () => {
      const mockCheckMachineExist = [];

      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(mockCheckMachineExist);

      try {
        await service.updateMachineConditionStatus(
          ctx,
          mockParams,
          mockUpdateMachineConditionInput,
        );
      } catch (error) {
        expect(error.message).toBe('Machine not found.');
        expect(error.response.statusCode).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw NotFoundException when machine deleted', async () => {
      const mockCheckMachineExist = [
        {
          machineId: 'machineS2NCG2HXHP4R35R6J0N',
          currentStatus: 'DELETED',
        },
      ];

      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(mockCheckMachineExist);

      try {
        await service.updateMachineConditionStatus(
          ctx,
          mockParams,
          mockUpdateMachineConditionInput,
        );
      } catch (error) {
        expect(error.message).toBe('Already deleted.');
        expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should machine condition was updated status successfully', async () => {
      const mockGroupMachineAssignment = {
        groupId: mockParams.groupId,
        groupName: 'group name',
        location: null,
        currentStatus: 'CREATED',
        lastStatusUpdatedAt: '2023-12-06T04:39:47.000Z',
      };
      mockMachineRepository.getMachineInGroupById.mockReturnValue(
        mockGroupMachineAssignment,
      );

      const mockDataSource = {
        insert: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const machineConditionRepo =
        mockDataSource.getRepository(MachineCondition);
      const machineConditionHistoryRepo = mockDataSource.getRepository(
        MachineConditionHistory,
      );

      await service.updateMachineConditionStatus(
        ctx,
        mockParams,
        mockUpdateMachineConditionInput,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineConditionRepo.update).toHaveBeenCalled();
      expect(machineConditionHistoryRepo.insert).toHaveBeenCalled();
    });
  });

  describe('deleteMachineInGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';

    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PR7W7',
    };

    it('should machine be deleted success', async () => {
      const machine = new Machine();

      mockMachineRepository.getMachineInGroupById.mockReturnValue(machine);

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
      const machineRepo = mockDataSource.getRepository(Machine);
      const machineHistoryRepo = mockDataSource.getRepository(MachineHistory);

      await service.deleteMachineInGroup(mockRequestContext, params);

      expect(spyTransaction).toHaveBeenCalled();
      expect(machineRepo.update).toHaveBeenCalled();
      expect(machineHistoryRepo.insert).toHaveBeenCalled();
    });

    it('should return NotFoundException when when machine not found', async () => {
      const mockCheckMachineExist = [];

      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(mockCheckMachineExist);

      try {
        await service.deleteMachineInGroup(mockRequestContext, params);
      } catch (error) {
        expect(error.message).toEqual('Machine not found.');
      }
    });

    it('should return NotFoundException when when machine deleted', async () => {
      const mockCheckMachineExist = [
        {
          machineId: 'machineS2NCG2HXHP4R35R6J0N',
          currentStatus: 'DELETED',
        },
      ];

      jest
        .spyOn(mockMachineRepository, 'getMachineInGroupById')
        .mockReturnValue(mockCheckMachineExist);

      try {
        await service.deleteMachineInGroup(mockRequestContext, params);
      } catch (error) {
        expect(error.message).toEqual('Already deleted.');
      }
    });
  });

  describe('findGroupsForWebapp', () => {
    const query = new GetGroupsQuery();
    query.status = UserGroupArchiveStatus.ARCHIVED;
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;

    it('get groups as a list success', async () => {
      const returnValues = {
        '01HKMA4Q54H04GBPB3EABCDWSX': {
          groupId: '01HKMA4Q54H04GBPB3EABCDWSX',
          groupName: 'group name',
          machineCount: 0,
          reportCount: 0,
          inspectionFormCount: 0,
          memberCount: 1,
          location: null,
          currentStatus: 'UPDATED',
          companyName: 'company name',
          permissions: {
            allowEditDeleteGroup: true,
            allowCreateEditDeleteMachine: true,
            allowCreateEditDeleteMember: true,
            allowCreateEditDeleteInspectionForm: true,
            allowCreateInspectionAndReport: true,
          },
        },
      };

      mockedRepository.countGroupForWebapp.mockReturnValue(1);

      mockedRepository.getGroupsForWebapp.mockResolvedValue(returnValues);

      mockedUserGroupAssignmentRepository.checkPermissionGroups.mockReturnValue(
        [
          {
            userId: 'userIdB0KQAJTME49F9XA1D6AA',
            groupId: '01HKMA4Q54H04GBPB3EABCDWSX',
            lastStatusUpdatedAt: '2024-01-29T03:09:31.000Z',
            currentStatus: 'ASSIGNED',
            userGroupRoleName: '',
            isAdmin: true,
            userGroupRoleTemplateId: 'templateIdRRTEF1A989H6AVJT',
            userGroupPermissionAssignments: [],
          },
        ],
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue([returnValues]),
      });

      const response = await service.findGroupsForWebapp(ctx, query);

      expect(response.data).toEqual([returnValues]);
      expect(response.meta).toEqual({
        pageInfo: { total: 1, limit: 10, page: 1 },
      });
    });

    it('get groups as a list success', async () => {
      mockedRepository.countGroupForWebapp.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await service.findGroupsForWebapp(ctx, query);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('getMachinesInGroupForWebapp', () => {
    const query = new GetMachineInGroupWebappQuery();
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;
    const mockParam: GroupParam = { groupId: groupId };
    it('get machines as a list success', async () => {
      const returnValues = [
        {
          machineId: '01HMB82AHTZ1EZY9T89DTDF6QK',
          pictureUrl: '',
          machineName: 'machine 1name',
          machineCondition: 'NORMAL',
          machineManufacturerName: 'OTHERS',
          machineType: 'OTHERS',
          modelAndType: 'model',
          serialNumber: '123112',
          reportCount: 1,
          reportOpenCount: 1,
          serialNumberPlatePictureUrl: '',
        },
      ];

      mockBlobStorageService.generateSasUrl.mockReturnValue(
        returnValues[0].pictureUrl,
      );

      mockMachineRepository.countMachinesInGroupForWebapp.mockResolvedValue(1);

      mockMachineRepository.countMachineReportForWebapp.mockReturnValue([
        {
          machineId: '01HMB82AHTZ1EZY9T89DTDF6QK',
          reportCount: 1,
          reportOpenCount: 1,
        },
      ]);

      mockMachineRepository.getMachinesInGroupForWebapp.mockResolvedValue(
        returnValues,
      );

      mockMachineRepository.getMachineServiceMeter.mockResolvedValue([]);

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues),
      });

      const response = await service.getMachinesInGroupForWebapp(
        ctx,
        mockParam,
        query,
      );

      expect(response.data).toEqual(returnValues);
      expect(response.meta).toEqual({
        pageInfo: { total: 1, limit: query.limit, page: query.page },
      });
    });

    it('get groups as a list success', async () => {
      mockMachineRepository.getMachinesInGroupForWebapp.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await service.getMachinesInGroupForWebapp(ctx, mockParam, query);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('getGroupMachineConditionDetail', () => {
    const mockParam: GroupParam = { groupId: groupId };
    it('get machines as a list success', async () => {
      const returnValues = {
        machineCount: 8,
        normalStatusCount: 7,
        warningStatusCount: 1,
        errorStatusCount: 0,
      };

      mockMachineRepository.getGroupMachineConditionDetail.mockResolvedValue(
        returnValues,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues),
      });

      const response = await service.getGroupMachineConditionDetail(
        ctx,
        mockParam,
      );

      expect(response).toEqual(returnValues);
    });

    it('get groups as a list success', async () => {
      mockMachineRepository.getGroupMachineConditionDetail.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await service.getGroupMachineConditionDetail(ctx, mockParam);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Get group detail info for webapp', () => {
    const mockGroupContext = new Group();
    const mockParam: GroupParam = { groupId: groupId };
    const groupDetailInfoForWebapp = {
      groupId: 'groupId088TD11HAEE3YFRN19C',
      groupName: 'group name',
      companyName: '',
      location: null,
      machineCount: 8,
      reportCount: 7,
    };

    const inspectionFormCount = {
      inspectionFormCount: 0,
    };

    const memberCount = {
      memberCount: 1,
    };
    it('should return group detail info for webapp', async () => {
      const returnValue = {
        ...groupDetailInfoForWebapp,
        ...inspectionFormCount,
        ...memberCount,
      };

      mockedRepository.getGroupsForWebapp.mockResolvedValue(returnValue);

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValue),
      });

      const machines = await service.getGroupDetailInfoForWebapp(
        ctx,
        mockParam,
        mockGroupContext,
      );

      expect(machines).toEqual(returnValue);
    });

    it('should throw error when groupRepository fail', async () => {
      mockedRepository.getGroupsForWebapp.mockRejectedValue({
        message: 'Test error',
      });
      try {
        await service.getGroupDetailInfoForWebapp(
          ctx,
          mockParam,
          mockGroupContext,
        );
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('countGroupInspectionFormStatus', () => {
    const mockParam: GroupParam = { groupId: groupId };
    it('get machines as a list success', async () => {
      const returnValues = {
        inspectionFormCount: 6,
        publishedStatusCount: 5,
        draftStatusCount: 0,
      };

      mockCustomInspectionFormRepository.countGroupInspectionFormStatus.mockResolvedValue(
        returnValues,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues),
      });

      const response = await service.countGroupInspectionFormStatus(
        ctx,
        mockParam,
      );

      expect(response).toEqual(returnValues);
    });

    it('get groups as a list success', async () => {
      mockCustomInspectionFormRepository.countGroupInspectionFormStatus.mockRejectedValue(
        {
          message: 'Test error',
        },
      );

      try {
        await service.countGroupInspectionFormStatus(ctx, mockParam);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Group inspection forms', () => {
    const query = new GetGroupInspectionFormQuery();
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;
    const mockParam: GroupParam = { groupId: groupId };
    const returnValues = {
      data: [
        {
          machineId: 'machineId4NZCYPA16S69RX4PA',
          inspectionFormId: 'inspectionFormIdSX4HTBTJ1B',
          machinePictureUrl: '',
          machineName: 'machine name 1111111111',
          inspectionFormName: 'qw',
          currentStatus: 'PUBLISHED',
          lastStatusUpdatedAt: '2024-01-17T02:53:07.000Z',
          surName: 'surname',
          givenName: 'givenName',
          userPictureUrl: '',
        },
      ],
      meta: {
        pageInfo: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    };
    it('should return group detail info for webapp', async () => {
      mockCustomInspectionFormRepository.countGroupInspectionForms.mockResolvedValue(
        1,
      );
      mockCustomInspectionFormRepository.getGroupInspectionForms.mockResolvedValue(
        returnValues.data,
      );

      mockBlobStorageService.generateSasUrl.mockReturnValue('');

      const response = await service.getGroupInspectionForms(
        ctx,
        mockParam,
        query,
      );

      expect(response).toEqual(returnValues);
    });

    it('should throw error when groupService fail', async () => {
      mockCustomInspectionFormRepository.countGroupInspectionForms.mockRejectedValue(
        {
          message: 'Test error',
        },
      );
      mockCustomInspectionFormRepository.getGroupInspectionForms.mockResolvedValue(
        returnValues.data,
      );

      try {
        await service.getGroupInspectionForms(ctx, mockParam, query);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('machineFieldsInGroup', () => {
    const query = new GetMachineInGroupWebappQuery();
    query.select = ['machineName' as MachineField];
    const mockParam: GroupParam = { groupId: groupId };
    it('should return list machine', async () => {
      const returnValues = [
        {
          machineId: 'machineIdSY31F75BC9DAJHTJK',
          machineName: 'machine name',
        },
      ];

      mockMachineRepository.getMachineFieldsInGroup.mockResolvedValue(
        returnValues,
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues),
      });

      const response = await service.machineFieldsInGroup(
        ctx,
        mockParam,
        query,
      );

      expect(response.data).toEqual(returnValues);
      expect(response.meta).toEqual({});
    });

    it('should return error', async () => {
      mockMachineRepository.getMachineFieldsInGroup.mockRejectedValue(
        new Error(),
      );

      try {
        await service.machineFieldsInGroup(ctx, mockParam, query);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('getAllDataForOffline', () => {
    const mockParam: GroupParam = { groupId: groupId };
    it('should return list machine', async () => {
      const returnValues = {
        userId: 'string',
        givenName: 'string',
        surname: 'string',
        pictureUrl: 'string',
        isoLocaleCode: 'en',
        syncedAt: '2023-10-18T02:03:31.000Z',
        group: {
          groupId: '01HCHJ6B2D0Z3EJ66E42KGXCCZ',
          groupName: 'string',
          machineAssignmentCount: 0,
          userAssignmentCount: 0,
        },
      };

      mockedRepository.getGroupDetail.mockResolvedValue({
        groupId: '01HCHJ6B2D0Z3EJ66E42KGXCCZ',
        groupName: 'string',
        machineAssignmentCount: 0,
        userAssignmentCount: 0,
      });

      mockMachineRepository.getMachinesInGroup.mockResolvedValue([]);
      mockCustomInspectionFormRepository.getInspectionFormsInGroup.mockResolvedValue(
        [],
      );
      mockCustomInspectionItemRepository.getCustomInspectionItemsInGroup.mockResolvedValue(
        [],
      );
      mockCustomInspectionItemMediaRepository.getCustomInspectionItemMediasInGroup.mockResolvedValue(
        [],
      );

      Object.defineProperty(classTransformerModule, 'plainToInstance', {
        value: jest.fn().mockReturnValue(returnValues),
      });

      const response = await service.getAllDataForOffline(ctx, mockParam);

      expect(response).toEqual(returnValues);
    });
  });
});
