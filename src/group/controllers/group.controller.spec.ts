import {
  CreateGroupInput,
  DeleteGroupsInput,
  GetGroupInspectionFormQuery,
  GetGroupsBaseOutput,
  GetGroupsQuery,
  GetGroupWebappOutput,
  GetMachineInGroupWebappQuery,
  GetUsersInGroupOutput,
  GroupAvailableMachineOutput,
  GroupAvailableMachineQuery,
  GroupCandidateUserOutput,
  GroupCandidateUserQuery,
  GroupDetailInfoOutput,
  GroupInvitationOutput,
  GroupInviteUserInput,
  GroupMachineParam,
  GroupParam,
  GroupsUserArchiveStatusInput,
  GroupUserParam,
  MachinesAssignIntoGroupInput,
  PermissionInGroupOutput,
  UpdateGroupInput,
  UpdateGroupOutput,
  UpdateMachineInGroupInput,
  UpdateMachineInGroupOutput,
  UserAssignmentInfoOutput,
  UserGroupAssignmentOutput,
  UserGroupAssignmentUpdateInput,
} from '@group/dtos';
import { Group } from '@group/entities';
import { GroupService } from '@group/services/group.service';
import {
  GetMachinesInGroupOutput,
  MachineDetailInfoOutput,
  MachineFavoriteOutput,
  MachineInput,
  MachineOutput,
  UpdateMachineConditionInput,
  UpdateMachineConditionOutput,
} from '@machine/dtos';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  GroupCurrentStatus,
  GroupMachineCondition,
  InvitationType,
  ISOLocaleCode,
  MachineFavoriteResponse,
  MachineField,
  Platform,
  UserGroupArchiveStatus,
} from '@shared/constants';
import { BaseApiResponse, UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { I18nService } from 'nestjs-i18n';

import { GroupController } from './group.controller';

describe('GroupController', () => {
  let controller: GroupController;
  const mockedGroupService = {
    findAll: jest.fn(),
    getGroupUsers: jest.fn(),
    createGroup: jest.fn(),
    getUserPermissionInGroup: jest.fn(),
    updateGroup: jest.fn(),
    deleteUserInGroup: jest.fn(),
    getGroupCandidateUsers: jest.fn(),
    inviteUserToGroup: jest.fn(),
    deleteGroups: jest.fn(),
    updateArchiveStatusUserGroup: jest.fn(),
    getUserAssignmentInfo: jest.fn(),
    updateUserGroupAssignment: jest.fn(),
    updateMachineFavoriteStatus: jest.fn(),
    getGroupAvailableMachines: jest.fn(),
    createMachineInGroup: jest.fn(),
    getGroupDetailInfo: jest.fn(),
    getMachinesInGroup: jest.fn(),
    assignMachineIntoGroup: jest.fn(),
    getMachineDetailInfo: jest.fn(),
    deleteMachineInGroup: jest.fn(),
    updateMachineInGroup: jest.fn(),
    getListMachineReport: jest.fn(),
    updateMachineConditionStatus: jest.fn(),
    findGroupsForWebapp: jest.fn(),
    getMachinesInGroupForWebapp: jest.fn(),
    getGroupDetailInfoForWebapp: jest.fn(),
    getGroupMachineConditionDetail: jest.fn(),
    getGroupInspectionForms: jest.fn(),
    countGroupInspectionFormStatus: jest.fn(),
    machineFieldsInGroup: jest.fn(),
    getAllDataForOffline: jest.fn(),
  };
  const mockI18n = { t: jest.fn() };
  const mockedLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
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
          provide: GroupService,
          useValue: mockedGroupService,
        },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get list site', () => {
    const query = new GetGroupsQuery();
    query.status = UserGroupArchiveStatus.ARCHIVED;
    it('should return list of groups', async () => {
      const returnValues: GetGroupsBaseOutput = {
        archivedGroups: [],
        unarchivedGroups: [
          {
            groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
            groupName: 'group name',
            location: 'location name',
            currentStatus: GroupCurrentStatus.CREATED,
            isArchived: false,
            lastStatusUpdatedAt: new Date(),
            userAssignmentCount: 1,
            machineAssignmentCount: 1,
            allowEditDeleteGroup: false,
            companyName: 'company name',
          },
        ],
      };
      mockedGroupService.findAll.mockResolvedValue(returnValues);

      const groups = await controller.findAll(ctx, query);
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedGroupService.findAll).toHaveBeenCalledWith(ctx, query);
    });

    it('should return array of null', async () => {
      mockedGroupService.findAll.mockResolvedValue([]);

      const groups = await controller.findAll(ctx, query);
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.findAll.mockRejectedValue(new BadRequestException());

      try {
        await controller.findAll(ctx, query);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('getGroupUsers', () => {
    it('should return list user in group when getGroupUsers success', async () => {
      const getUsersInGroupOutput = new GetUsersInGroupOutput();

      jest
        .spyOn(mockedGroupService, 'getGroupUsers')
        .mockReturnValue(getUsersInGroupOutput);

      const mockGroupId: GroupParam = { groupId: groupId };

      const result = await controller.getGroupUsers(ctx, mockGroupId);

      expect(result).toEqual({
        data: getUsersInGroupOutput,
        meta: {},
      });
    });

    it('should return error when getGroupUsers service fail', async () => {
      jest
        .spyOn(mockedGroupService, 'getGroupUsers')
        .mockRejectedValue({ message: 'Test error' });

      const mockGroupId: GroupParam = { groupId: groupId };

      try {
        await controller.getGroupUsers(ctx, mockGroupId);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Get user permissions in group API', () => {
    it('should return permissions in group', async () => {
      const params: GroupParam = { groupId };
      const returnValues: PermissionInGroupOutput = {
        groupId: params.groupId,
        permissions: {
          USER_GROUP_ASSIGNMENTS: 'CREATE_UPDATE',
        },
        userId,
      };
      mockedGroupService.getUserPermissionInGroup.mockResolvedValue(
        returnValues,
      );

      const groups = await controller.getUserPermissionInGroup(ctx, params);

      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedGroupService.getUserPermissionInGroup).toHaveBeenCalledWith(
        ctx,
        params,
      );
    });

    it('should throw error when groupService fail', async () => {
      const params: GroupParam = { groupId };
      mockedGroupService.getUserPermissionInGroup.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.getUserPermissionInGroup(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('createGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;

    it('should throw error when groupService fail', async () => {
      const createGroupInput: CreateGroupInput = {
        groupName: 'group name',
        companyName: 'company name',
        allowNonKomatsuInfoUse: false,
      };

      mockedGroupService.createGroup.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.createGroup(mockRequestContext, createGroupInput);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should create a group successfully', async () => {
      const createGroupInput: CreateGroupInput = {
        groupName: 'group name',
        companyName: 'company name',
        allowNonKomatsuInfoUse: false,
      };

      const mockCreateGroup = {
        groupId: 'group01HD0E2GAANRQ80VJZVD3SEYX6',
        groupName: 'group name',
        assignedCompanyName: 'company name',
        location: 'location',
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      mockI18n.t.mockReturnValue('Group added successfully.');
      mockedGroupService.createGroup.mockResolvedValue(mockCreateGroup);

      const response = await controller.createGroup(
        mockRequestContext,
        createGroupInput,
      );

      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'createGroup was called',
      );
      expect(response.data).toEqual(mockCreateGroup);
      expect(response.meta.successMessage).toEqual('Group added successfully.');
    });
  });

  describe('deleteUserInGroup', () => {
    const params: GroupUserParam = {
      userId,
      groupId,
    };

    it('should delete user in group successfully', async () => {
      mockI18n.t.mockReturnValue('Deleted successfully.');

      const response = await controller.deleteUserInGroup(ctx, params);

      expect(mockedLogger.log).toHaveBeenCalledWith(
        ctx,
        'deleteUserInGroup was called',
      );
      expect(response.meta.successMessage).toEqual('Deleted successfully.');
    });

    it('should delete user in group with an error', async () => {
      mockedGroupService.deleteUserInGroup.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.deleteUserInGroup(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('getGroupCandidateUsers', () => {
    const mockParam: GroupParam = {
      groupId: groupId,
    };

    const mockQuery: GroupCandidateUserQuery = {
      search: 'mock search',
    };

    it('should return list candidate user when getGroupCandidateUsers success', async () => {
      const mockGroupCandidateUserOutput = new GroupCandidateUserOutput();

      jest
        .spyOn(mockedGroupService, 'getGroupCandidateUsers')
        .mockReturnValue([mockGroupCandidateUserOutput]);

      const result = await controller.getGroupCandidateUsers(
        ctx,
        mockParam,
        mockQuery,
      );

      expect(result).toEqual({
        data: [mockGroupCandidateUserOutput],
        meta: {},
      });
    });

    it('should return error when getGroupCandidateUsers service fail', async () => {
      jest
        .spyOn(mockedGroupService, 'getGroupCandidateUsers')
        .mockRejectedValue({ message: 'Test error' });

      try {
        await controller.getGroupCandidateUsers(ctx, mockParam, mockQuery);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Invite user to group', () => {
    const mockGroupParam: GroupParam = { groupId };
    const groupInviteUserInput: GroupInviteUserInput = {
      inviteeUserId: 'inviteeUserE0SAVCGDC8DMP74E',
      isAdmin: true,
      userGroupRoleName: 'group name',
      permissionIds: ['permissionE0SAVCGDC8DMP74E'],
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    it('Should throw error when groupService.inviteUserToGroup fail', async () => {
      mockedGroupService.inviteUserToGroup.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.inviteUserToGroup(
          ctx,
          mockGroupParam,
          groupInviteUserInput,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('Should create a group successfully', async () => {
      const mockServiceResponse: BaseApiResponse<GroupInvitationOutput> = {
        data: {
          groupInvitationId: 'groupInvitationE0SAVCGDC8DMP74E',
          inviterUserId: 'inviterUserE0SAVCGDC8DMP74E',
          invitedAt: new Date(),
          invitationType: InvitationType.EXISTING_USER_INVITE,
          inviteeUserId: 'inviteeUserE0SAVCGDC8DMP74E',
          inviteeEmail: 'user@example.com',
          inviteeName: 'user name',
          userGroupRoleName: 'group role name',
          respondedAt: null,
          invitationResponse: null,
        },
        meta: {},
      };

      mockI18n.t.mockReturnValue('Group added successfully.');
      mockedGroupService.inviteUserToGroup.mockResolvedValue(
        mockServiceResponse,
      );

      expect(
        controller.inviteUserToGroup(ctx, mockGroupParam, groupInviteUserInput),
      ).resolves.toStrictEqual(mockServiceResponse);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        ctx,
        'inviteUserToGroup was called',
      );
    });
  });

  describe('Update groups user status', () => {
    const mockServiceResponse: BaseApiResponse<object> = {
      data: {},
      meta: {},
    };
    const body: GroupsUserArchiveStatusInput = {
      isArchived: true,
      groupIds: ['groupE2D3DE0SAVCGDC8DMP74E'],
    };

    it('Should throw error when groupService.updateArchiveStatusUserGroup fail', async () => {
      mockedGroupService.inviteUserToGroup.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateArchiveStatusUserGroup(ctx, body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('Should update groups user status successfully', async () => {
      mockedGroupService.updateArchiveStatusUserGroup.mockResolvedValue(
        mockServiceResponse,
      );

      expect(
        controller.updateArchiveStatusUserGroup(ctx, body),
      ).resolves.toStrictEqual(mockServiceResponse);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        ctx,
        'updateArchiveStatusUserGroup was called',
      );
    });
  });

  describe('getUserAssignmentInfo', () => {
    const params: GroupUserParam = {
      userId,
      groupId,
    };

    it('should throw error if get user assignment info with an error', async () => {
      mockedGroupService.getUserAssignmentInfo.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.getUserAssignmentInfo(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should user assignment info in group successfully', async () => {
      const mockUserAssignmentInfo: UserAssignmentInfoOutput = {
        userId: userId,
        givenName: 'given name',
        surname: 'surname',
        groupId: groupId,
        roleName: 'role name',
        permissions: [
          {
            permissionId: 'permissionId12345678910111',
            isoLocaleCode: ISOLocaleCode.JA,
            permissionName: 'permission name',
            isChecked: true,
          },
        ],
        isAdmin: false,
        userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
      };

      mockedGroupService.getUserAssignmentInfo.mockReturnValue(
        mockUserAssignmentInfo,
      );

      expect(await controller.getUserAssignmentInfo(ctx, params)).toEqual({
        data: mockUserAssignmentInfo,
        meta: {},
      });
    });
  });

  describe('Update groups user status', () => {
    const mockServiceResponse: BaseApiResponse<object> = {
      data: {},
      meta: {},
    };
    const body: GroupsUserArchiveStatusInput = {
      isArchived: true,
      groupIds: ['groupE2D3DE0SAVCGDC8DMP74E'],
    };

    it('Should throw error when groupService.updateArchiveStatusUserGroup fail', async () => {
      mockedGroupService.inviteUserToGroup.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateArchiveStatusUserGroup(ctx, body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('Should update groups user status successfully', async () => {
      mockedGroupService.updateArchiveStatusUserGroup.mockResolvedValue(
        mockServiceResponse,
      );

      expect(
        controller.updateArchiveStatusUserGroup(ctx, body),
      ).resolves.toStrictEqual(mockServiceResponse);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        ctx,
        'updateArchiveStatusUserGroup was called',
      );
    });
  });

  describe('updateGroup', () => {
    const mockRequestContext = new RequestContext();
    const mockParam: GroupParam = {
      groupId,
    };
    const mockUpdateGroupInput: UpdateGroupInput = {
      groupName: 'mock group name',
      location: 'mock location',
      companyName: 'company name',
      allowNonKomatsuInfoUse: false,
    };

    const mockGroupContext = new Group();

    it('should throw error when updateGroup service fail', async () => {
      mockedGroupService.updateGroup.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.updateGroup(
          mockRequestContext,
          mockParam,
          mockUpdateGroupInput,
          mockGroupContext,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should group was updated successfully', async () => {
      const mockUpdateGroupOutput: UpdateGroupOutput = {
        groupId: 'group01HD0E2GAANRQ80VJZVD3SEYX6',
        groupName: 'mock group name',
        location: 'mock location',
        currentStatus: 'UPDATED',
        lastStatusUpdatedAt: new Date(),
        companyName: 'company name',
        allowNonKomatsuInfoUse: false,
      };

      mockedGroupService.updateGroup.mockResolvedValue(mockUpdateGroupOutput);

      const response = await controller.updateGroup(
        mockRequestContext,
        mockParam,
        mockUpdateGroupInput,
        mockGroupContext,
      );

      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'updateGroup was called',
      );
      expect(response.data).toEqual(mockUpdateGroupOutput);
      expect(response.meta).toEqual({});
    });
  });

  describe('deleteGroups', () => {
    const mockInput: DeleteGroupsInput = {
      groupIds: ['065D212J34D8MAJ2SZZHN32ZB0', '065EX9ZM6196CQWRT37JHXSW7C'],
    };
    it('should return message delete group success when deleteGroups service success', async () => {
      const mockOutput: BaseApiResponse<object> = {
        data: {},
        meta: {
          successMessage: 'Deleted successfully.',
        },
      };

      jest
        .spyOn(mockedGroupService, 'deleteGroups')
        .mockReturnValue(mockOutput);

      const result = await controller.deleteGroups(ctx, mockInput);

      expect(result).toEqual(mockOutput);
    });

    it('should return error when deleteGroups service fail', async () => {
      jest
        .spyOn(mockedGroupService, 'deleteGroups')
        .mockRejectedValue({ message: 'Test error' });

      try {
        await controller.deleteGroups(ctx, mockInput);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('getGroupDetailInfo', () => {
    const mockGroupContext = new Group();

    const params: GroupParam = {
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    it('should return error when getGroupDetailInfo service fail', async () => {
      mockedGroupService.getGroupDetailInfo.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.getGroupDetailInfo(ctx, params, mockGroupContext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should return get group detail info successfully', async () => {
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

      mockedGroupService.getGroupDetailInfo.mockReturnValue(mockOutput);

      const result = await controller.getGroupDetailInfo(
        ctx,
        params,
        mockGroupContext,
      );

      expect(result.data).toEqual(mockOutput);
    });
  });

  describe('Update user info group assignment', () => {
    const mockServiceResponse: BaseApiResponse<UserGroupAssignmentOutput> = {
      data: {
        userId,
        groupId,
        userGroupRoleName: 'roleName',
        lastStatusUpdatedAt: new Date(),
      },
      meta: {
        successMessage: 'Edited successfully.',
      },
    };

    const params: GroupUserParam = {
      groupId,
      userId,
    };
    const body: UserGroupAssignmentUpdateInput = {
      isAdmin: false,
      userGroupRoleName: 'roleName',
      permissionIds: [],
      userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
    };

    it('Should throw error when groupService.updateUserGroupAssignment fail', async () => {
      mockedGroupService.updateUserGroupAssignment.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateUserGroupAssignment(ctx, params, body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('Should update user info group assignment successfully', async () => {
      mockI18n.t.mockReturnValue('Edited successfully.');
      mockedGroupService.updateUserGroupAssignment.mockResolvedValue(
        mockServiceResponse.data,
      );

      expect(
        controller.updateUserGroupAssignment(ctx, params, body),
      ).resolves.toStrictEqual(mockServiceResponse);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        ctx,
        'updateUserGroupAssignment was called',
      );
    });
  });

  describe('updateMachineFavoriteStatus', () => {
    const params: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    it('should return error when updateMachineFavoriteStatus service fail', async () => {
      mockedGroupService.updateMachineFavoriteStatus.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateMachineFavoriteStatus(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should return CREATED/DELETED status when update favorite/un-favorite status successfully', async () => {
      const mockOutput: MachineFavoriteOutput = {
        status: MachineFavoriteResponse.CREATED,
      };

      mockedGroupService.updateMachineFavoriteStatus.mockReturnValue(
        mockOutput,
      );

      const result = await controller.updateMachineFavoriteStatus(ctx, params);

      expect(result.data).toEqual(mockOutput);
    });
  });

  describe('Get list machine type', () => {
    const query = new GetMachineInGroupWebappQuery();
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;
    it('should return list machines', async () => {
      const returnValues: GetMachinesInGroupOutput = {
        favoriteMachines: [],
        unFavoriteMachines: [],
      };
      const mockGroupId: GroupParam = { groupId: groupId };

      mockedGroupService.getMachinesInGroup.mockResolvedValue(returnValues);
      const groups = await controller.getMachinesInGroup(
        ctx,
        mockGroupId,
        query,
      );
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedGroupService.getMachinesInGroup).toHaveBeenCalledWith(
        ctx,
        mockGroupId,
      );
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.getMachinesInGroup.mockRejectedValue(new Error());
      const mockGroupId: GroupParam = { groupId: groupId };
      try {
        await controller.getMachinesInGroup(ctx, mockGroupId, query);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should return list machines', async () => {
      query.select = ['machineName' as MachineField];

      const returnValues = [
        {
          machineId: 'machineIdSY31F75BC9DAJHTJK',
          machineName: 'machine name',
        },
      ];
      const mockGroupId: GroupParam = { groupId: groupId };

      mockedGroupService.machineFieldsInGroup.mockResolvedValue({
        data: returnValues,
        meta: {},
      });
      const groups = await controller.getMachinesInGroup(
        ctx,
        mockGroupId,
        query,
      );
      expect(groups).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedGroupService.getMachinesInGroup).toHaveBeenCalledWith(
        ctx,
        mockGroupId,
      );
    });

    it('should machineFieldsInGroup return error', async () => {
      query.select = ['machineName' as MachineField];

      const mockGroupId: GroupParam = { groupId: groupId };

      mockedGroupService.machineFieldsInGroup.mockRejectedValue(new Error());
      try {
        await controller.getMachinesInGroup(ctx, mockGroupId, query);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Assign machine into group', () => {
    const mockBody: MachinesAssignIntoGroupInput = {
      machineIds: ['machineS2NCG2HXHP4R35R6J0N'],
    };
    const mockGroupId: GroupParam = { groupId: groupId };
    const mockServiceResponse: BaseApiResponse<object> = {
      data: {},
      meta: {},
    };
    it('Assign machine into group: success', async () => {
      mockedGroupService.assignMachineIntoGroup.mockResolvedValue(
        mockServiceResponse,
      );
      const groups = await controller.assignMachineIntoGroup(
        ctx,
        mockGroupId,
        mockBody,
      );
      expect(groups).toEqual(mockServiceResponse);
      expect(mockedGroupService.assignMachineIntoGroup).toHaveBeenCalledWith(
        ctx,
        mockGroupId,
        mockBody,
      );
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.assignMachineIntoGroup.mockRejectedValue(new Error());
      try {
        await controller.assignMachineIntoGroup(ctx, mockGroupId, mockBody);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('createMachineInGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    const mockParam: GroupParam = {
      groupId,
    };

    const mockMachineInput = new MachineInput();

    it('should throw error when createMachineInGroup service fail', async () => {
      mockedGroupService.createMachineInGroup.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.createMachineInGroup(
          mockRequestContext,
          mockParam,
          mockMachineInput,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should machine was created successfully', async () => {
      const mockMachineOutput = new MachineOutput();
      mockI18n.t.mockReturnValue('Added machine successfully.');

      mockedGroupService.createMachineInGroup.mockResolvedValue(
        mockMachineOutput,
      );

      const response = await controller.createMachineInGroup(
        mockRequestContext,
        mockParam,
        mockMachineInput,
      );

      expect(response.data).toEqual(mockMachineOutput);
      expect(response.meta).toEqual({
        successMessage: 'Added machine successfully.',
      });
    });
  });

  describe('getGroupAvailableMachines', () => {
    const params: GroupParam = {
      groupId,
    };
    const query: GroupAvailableMachineQuery = {
      search: 'search',
    };

    it('Should throw error when groupService.getGroupAvailableMachines fail', async () => {
      mockedGroupService.getGroupAvailableMachines.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getGroupAvailableMachines(ctx, params, query);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('Should get list available machine successfully', async () => {
      const mockGroupAvailableMachineOutput: GroupAvailableMachineOutput[] = [
        {
          machineId: 'machineIdN9Q0KYA36EJ6PR7W7',
          machineName: 'machine name',
          pictureUrl: 'https://picsum.photos/id/1/200/200',
          modelAndType: 'model',
          isAlreadyInGroup: true,
          machineManufacturerName: 'manufacturer name',
        },
      ];

      mockedGroupService.getGroupAvailableMachines.mockResolvedValue(
        mockGroupAvailableMachineOutput,
      );

      const result = await controller.getGroupAvailableMachines(
        ctx,
        params,
        query,
      );

      expect(result.data).toEqual(mockGroupAvailableMachineOutput);
      expect(result.meta).toEqual({});
    });
  });

  describe('getMachineDetailInfo', () => {
    const params: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    it('should return error when getMachineDetailInfo service fail', async () => {
      mockedGroupService.getMachineDetailInfo.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.getMachineDetailInfo(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });

    it('Should get machine detail info successfully', async () => {
      const mockMachineDetailInfoOutput: MachineDetailInfoOutput = {
        machineId: params.groupId,
        machineName: 'machine name',
        pictureUrl: 'https://picsum.photos/id/1/200/200',
        modelAndType: 'model',
        machineManufacturerName: 'manufacturer name',
        machineTypeName: 'type name',
        serialNumber: '10',
        machineCondition: GroupMachineCondition.NORMAL,
        serialNumberPlatePictureUrl: 'https://picsum.photos/id/1/200/200',
        isFavorite: false,
        machineTypeId: 'machineType6HBCYXJXH71V',
        machineManufacturerId: 'machineManufacturer6HXH71V',
        filePath: '',
        serialNumberFilePath: 'serialNumberFilePath',
        customTypeName: null,
        customMachineManufacturerName: null,
        isOtherMachineManufacturer: false,
        isOtherMachineType: false,
      };

      mockedGroupService.getMachineDetailInfo.mockReturnValue(
        mockMachineDetailInfoOutput,
      );

      const result = await controller.getMachineDetailInfo(ctx, params);

      expect(result.data).toEqual(mockMachineDetailInfoOutput);
      expect(result.meta).toEqual({});
    });
  });

  describe('updateMachineInGroup', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.user.userId = 'userYE1S2NCG2HXHP4R35R6J0N';
    mockRequestContext.user.isoLocaleCode = ISOLocaleCode.EN;
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const mockUpdateMachineInGroupInput = new UpdateMachineInGroupInput();

    it('should throw error when updateMachineInGroup service fail', async () => {
      mockedGroupService.updateMachineInGroup.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.updateMachineInGroup(
          mockRequestContext,
          mockParams,
          mockUpdateMachineInGroupInput,
        );
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('should machine was updated successfully', async () => {
      const mockUpdateMachineInGroupOutput = new UpdateMachineInGroupOutput();

      mockedGroupService.updateMachineInGroup.mockResolvedValue(
        mockUpdateMachineInGroupOutput,
      );

      const response = await controller.updateMachineInGroup(
        mockRequestContext,
        mockParams,
        mockUpdateMachineInGroupInput,
      );

      expect(response.data).toEqual(mockUpdateMachineInGroupOutput);
    });
  });

  describe('updateMachineConditionStatus', () => {
    const mockParams: GroupMachineParam = {
      machineId: 'machine01HD0E2GAANRQ80VJZDEW',
      groupId: 'group01HD0E2GAANRQ80VJZVD3S',
    };

    const mockInput: UpdateMachineConditionInput = {
      machineCondition: GroupMachineCondition.NORMAL,
    };

    it('should throw error when updateMachineConditionStatus service fail', async () => {
      mockedGroupService.updateMachineConditionStatus.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateMachineConditionStatus(
          ctx,
          mockParams,
          mockInput,
        );
      } catch (error) {
        expect(error.message).toBe('Bad request error');
      }
    });

    it('should update machine condition successfully', async () => {
      const mockUpdateMachineConditionOutput =
        new UpdateMachineConditionOutput();

      mockedGroupService.updateMachineConditionStatus.mockResolvedValue(
        mockUpdateMachineConditionOutput,
      );

      const response = await controller.updateMachineConditionStatus(
        ctx,
        mockParams,
        mockInput,
      );

      expect(response.data).toEqual(mockUpdateMachineConditionOutput);
    });
  });

  describe('deleteMachineInGroup', () => {
    const params: GroupMachineParam = {
      groupId,
      machineId: 'machineIdN9Q0KYA36EJ6PR7W7',
    };

    it('Should throw error when groupService.deleteMachineInGroup fail', async () => {
      mockedGroupService.deleteMachineInGroup.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.deleteMachineInGroup(ctx, params);
      } catch (error) {
        expect(error.message).toBe('Test error');
      }
    });

    it('Should machine be deleted successfully', async () => {
      mockedGroupService.deleteMachineInGroup.mockResolvedValue({
        data: {},
        meta: {
          successMessage: 'Deleted successfully.',
        },
      });

      mockI18n.t.mockReturnValue('Deleted successfully.');

      const result = await controller.deleteMachineInGroup(ctx, params);

      expect(result.data).toEqual({});
      expect(result.meta).toEqual({ successMessage: 'Deleted successfully.' });
    });
  });

  describe('Get list group for webapp', () => {
    const query = new GetGroupsQuery();
    query.status = UserGroupArchiveStatus.ARCHIVED;
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;
    const header = Platform.WEBAPP;
    it('should return list of groups webapp', async () => {
      const returnValues: GetGroupWebappOutput = {
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
      };

      mockedGroupService.findGroupsForWebapp.mockResolvedValue({
        data: [returnValues],
        meta: {
          pageInfo: { total: 1, limit: 10, page: 1 },
        },
      });

      const groups = await controller.findAll(ctx, query, header);
      expect(groups).toEqual({
        data: [returnValues],
        meta: {
          pageInfo: { total: 1, limit: 10, page: 1 },
        },
      });
    });

    it('should return array of null', async () => {
      mockedGroupService.findGroupsForWebapp.mockResolvedValue({
        data: [],
        meta: {
          total: 1,
        },
      });

      const groups = await controller.findAll(ctx, query, header);
      expect(groups.data).toHaveLength(0);
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.findGroupsForWebapp.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.findAll(ctx, query, header);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('Get list machine in group for webapp', () => {
    const query = new GetMachineInGroupWebappQuery();
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;
    const header = Platform.WEBAPP;
    const mockParam: GroupParam = { groupId: groupId };
    it('should return list of machine in group webapp', async () => {
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
        },
      ];

      mockedGroupService.getMachinesInGroupForWebapp.mockResolvedValue({
        data: returnValues,
        meta: {
          pageInfo: { total: 1, page: query.page, limit: query.limit },
        },
      });

      const machines = await controller.getMachinesInGroup(
        ctx,
        mockParam,
        query,
        header,
      );
      expect(machines.data).toEqual(returnValues);
      expect(machines.meta).toEqual({
        pageInfo: {
          total: 1,
          page: query.page,
          limit: query.limit,
        },
      });
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.getMachinesInGroupForWebapp.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.getMachinesInGroup(ctx, mockParam, query, header);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('Get list machine in group for webapp', () => {
    const mockParam: GroupParam = { groupId: groupId };
    it('should return list of machine in group webapp', async () => {
      const returnValues = {
        machineCount: 8,
        normalStatusCount: 7,
        warningStatusCount: 1,
        errorStatusCount: 0,
      };

      mockedGroupService.getGroupMachineConditionDetail.mockResolvedValue(
        returnValues,
      );

      const machineConditionDetail =
        await controller.getGroupMachineConditionDetail(ctx, mockParam);

      expect(machineConditionDetail.data).toEqual(returnValues);
      expect(machineConditionDetail.meta).toEqual({});
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.getGroupMachineConditionDetail.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getGroupMachineConditionDetail(ctx, mockParam);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Count group inspection form status for webapp', () => {
    const mockParam: GroupParam = { groupId: groupId };
    it('should return group inspection form status count webapp', async () => {
      const returnValues = {
        inspectionFormCount: 6,
        publishedStatusCount: 5,
        draftStatusCount: 0,
      };

      mockedGroupService.countGroupInspectionFormStatus.mockResolvedValue(
        returnValues,
      );

      const machineConditionDetail =
        await controller.countGroupInspectionFormStatus(ctx, mockParam);

      expect(machineConditionDetail.data).toEqual(returnValues);
      expect(machineConditionDetail.meta).toEqual({});
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.countGroupInspectionFormStatus.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.countGroupInspectionFormStatus(ctx, mockParam);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Get group detail info for webapp', () => {
    const query = new GetMachineInGroupWebappQuery();
    query.orderBys = [];
    query.limit = 10;
    query.page = 1;
    const header = Platform.WEBAPP;
    const mockParam: GroupParam = { groupId: groupId };
    const mockGroupContext = new Group();
    it('should return group detail info for webapp', async () => {
      const returnValues = {
        groupId: 'groupId088TD11HAEE3YFRN19C',
        groupName: 'group name',
        companyName: '',
        location: null,
        machineCount: 8,
        inspectionFormCount: 0,
        reportCount: 7,
        memberCount: 1,
      };
      mockedGroupService.getGroupDetailInfoForWebapp.mockResolvedValue(
        returnValues,
      );

      const machines = await controller.getGroupDetailInfo(
        ctx,
        mockParam,
        mockGroupContext,
        header,
      );

      expect(machines.data).toEqual(returnValues);
      expect(machines.meta).toEqual({});
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.getGroupDetailInfoForWebapp.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getGroupDetailInfo(
          ctx,
          mockParam,
          mockGroupContext,
          header,
        );
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
    it('should return group detail info for webapp', async () => {
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
            userPictureUrl:
              'https://image.com/f212121b1c65a87f040a12408aee9369fa',
          },
        ],
        meta: {
          pageInfo: {
            total: 1,
            page: 1,
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

      mockedGroupService.getGroupInspectionForms.mockResolvedValue(
        returnValues,
      );

      const response = await controller.getGroupInspectionForms(
        ctx,
        mockParam,
        query,
      );

      expect(response).toEqual(returnValues);
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.getGroupInspectionForms.mockRejectedValue({
        message: 'Test error',
      });

      try {
        await controller.getGroupInspectionForms(ctx, mockParam, query);
      } catch (error) {
        expect(error.message).toEqual('Test error');
      }
    });
  });

  describe('Get data for all offline support table', () => {
    const params: GroupParam = { groupId };
    it('should return list of groups', async () => {
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
      mockedGroupService.getAllDataForOffline.mockResolvedValue(returnValues);

      const data = await controller.getAllDataForOffline(ctx, params);
      expect(data).toEqual({
        data: returnValues,
        meta: {},
      });
      expect(mockedGroupService.getAllDataForOffline).toHaveBeenCalledWith(
        ctx,
        params,
      );
    });

    it('should throw error when groupService fail', async () => {
      mockedGroupService.getAllDataForOffline.mockRejectedValue(
        new BadRequestException(),
      );

      try {
        await controller.getAllDataForOffline(ctx, params);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
