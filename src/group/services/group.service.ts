import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { BlobStorageFileService } from '@blob-storage/services/blob-storage-file.service';
import {
  CountMachineReport,
  CreateGroupInput,
  GetGroupDataOfflineOutput,
  GetGroupInspectionFormDetailOutput,
  GetGroupInspectionFormOutput,
  GetGroupInspectionFormQuery,
  GetGroupMachineConditionDetailOutput,
  GetGroupsBaseOutput,
  GetGroupsQuery,
  GetGroupWebappOutput,
  GetMachineInGroupWebappQuery,
  GetMachinesInGroupWebappOutput,
  GetUsersInGroupOutput,
  GroupAvailableMachineOutput,
  GroupCandidateUserOutput,
  GroupDetailInfoOutput,
  GroupDetailInfoWebappOutput,
  GroupInvitationOutput,
  GroupInviteUserInput,
  GroupMachineParam,
  GroupOutput,
  GroupParam,
  GroupsUserArchiveStatusInput,
  GroupUserParam,
  MachinesAssignIntoGroupInput,
  PermissionInGroupOutput,
  UpdateGroupInput,
  UpdateGroupOutput,
  UpdateMachineInGroupInput,
  UserAssignmentInfoOutput,
  UserGroupAssignmentOutput,
  UserGroupAssignmentUpdateInput,
} from '@group/dtos';
import { Group, GroupHistory, GroupInvitation } from '@group/entities';
import { GroupRepository } from '@group/repositories';
import {
  CustomInspectionFormRepository,
  CustomInspectionItemMediaRepository,
  CustomInspectionItemRepository,
} from '@inspection/repositories';
import {
  GetMachinesInGroupOutput,
  MachineDetailInfoOutput,
  MachineFavoriteOutput,
  MachineInput,
  MachineOutput,
  UpdateMachineConditionInput,
  UpdateMachineConditionOutput,
} from '@machine/dtos';
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
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ALL_MACHINE_TYPES,
  EMAIL_REGEX,
  ErrorType,
  ESCAPE_CHAR,
  EventType,
  GroupCurrentStatus,
  GroupHistoryEventType,
  GroupMachineCondition,
  GroupSortByField,
  InvitationResponse,
  InvitationType,
  ISOLocaleCode,
  MACHINE_MANUFACTURER_KMT,
  MACHINE_MANUFACTURER_NAME_CUSTOM,
  MACHINE_SUGGESTION_LIMIT,
  MACHINE_TYPE_CODE_CUSTOM,
  MachineCurrentStatus,
  MachineFavoriteResponse,
  Operation,
  Order,
  OTHER_MACHINE_MANUFACTURERS,
  OTHER_MACHINE_TYPES,
  Resource,
  SEARCH_ID_LENGTH,
  SERIAL_NUMBER_VALID_FILE,
  UserGroupAssignmentCurrentStatus,
  UserGroupAssignmentHistoryEventType,
  WILDCARD_REGEX,
} from '@shared/constants';
import { BaseApiResponse } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { formatServiceMeter } from '@shared/utils/commons';
import { checkUserNotFound } from '@shared/utils/errors';
import {
  User,
  UserGroupAssignment,
  UserGroupAssignmentHistory,
  UserGroupPermissionAssignment,
  UserGroupPermissionInvitation,
  UserGroupSetting,
} from '@user/entities';
import {
  UserGroupAssignmentRepository,
  UserGroupSettingRepository,
  UserRepository,
} from '@user/repositories';
import {
  PermissionRepository,
  UserGroupRoleTemplateRepository,
} from '@user-group-role-template/repositories';
import { plainToInstance } from 'class-transformer';
import { isNumberString } from 'class-validator';
import { I18nService } from 'nestjs-i18n';
import { DataSource, EntityManager, In, Not } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class GroupService {
  constructor(
    private readonly repository: GroupRepository,
    private readonly userGroupRoleTemplateRepository: UserGroupRoleTemplateRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly userGroupAssignmentRepository: UserGroupAssignmentRepository,
    private readonly userGroupSettingRepository: UserGroupSettingRepository,
    private readonly machineManufacturerRepository: MachineManufacturerRepository,
    private readonly machineTypeRepository: MachineTypeRepository,
    private readonly machineRepository: MachineRepository,
    private readonly customInspectionFormRepository: CustomInspectionFormRepository,
    private readonly customInspectionItemRepository: CustomInspectionItemRepository,
    private readonly customInspectionItemMediaRepository: CustomInspectionItemMediaRepository,
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
    private readonly storageService: BlobStorageService,
    private readonly storageFileService: BlobStorageFileService,
  ) {
    this.logger.setContext(GroupService.name);
  }

  async findAll(
    ctx: RequestContext,
    query: GetGroupsQuery,
  ): Promise<GetGroupsBaseOutput> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    const updateGroupPermission =
      await this.permissionRepository.getPermissionByResourceAndOperation(
        Operation.UPDATE_DELETE,
        Resource.GROUPS,
      );

    if (!updateGroupPermission) {
      throw new NotFoundException('Permission template not found.');
    }

    const groups = await this.repository.findAll(
      ctx.user.userId,
      updateGroupPermission.permissionId,
      query,
    );

    return plainToInstance(
      GetGroupsBaseOutput,
      groups.reduce(
        (acc, group) => {
          group.isArchived
            ? acc.archivedGroups.push(group)
            : acc.unarchivedGroups.push(group);
          return acc;
        },
        { archivedGroups: [], unarchivedGroups: [] },
      ),
    );
  }

  async getGroupUsers(
    ctx: RequestContext,
    groupId: string,
  ): Promise<GetUsersInGroupOutput[]> {
    this.logger.log(ctx, `${this.getGroupUsers.name} was called`);

    const isoLocaleCode = ctx.isoLocaleCode;
    const users = await this.userRepository.getGroupUsers(
      groupId,
      isoLocaleCode,
    );

    return plainToInstance(
      GetUsersInGroupOutput,
      users.map((user) => ({
        ...user,
        userGroupAssignment: {
          ...user.userGroupAssignments[0],
          userGroupRoleName:
            user.userGroupAssignments[0].userGroupRoleName ||
            user.userGroupAssignments[0].userGroupRoleNameTranslation.roleName,
        },
        pictureUrl: this.storageService.generateSasUrl(user.pictureUrl),
      })),
    );
  }

  async createGroup(
    ctx: RequestContext,
    createGroupInput: CreateGroupInput,
  ): Promise<GroupOutput> {
    this.logger.log(ctx, `${this.createGroup.name} was called`);
    const timeNow = new Date();

    // Get the manager template permissions
    const userRole =
      await this.userGroupRoleTemplateRepository.getRoleTemplateManager(
        ctx.isoLocaleCode,
      );
    if (!userRole?.userGroupRoleNameTranslations?.length) {
      throw new NotFoundException('Role template not found.');
    }

    // Create transaction
    const group = await this.dataSource.transaction(async (tx) => {
      const groupRepo = tx.getRepository(Group);
      const groupHistoryRepo = tx.getRepository(GroupHistory);
      const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);
      const userGroupAssignmentHistoryRepo = tx.getRepository(
        UserGroupAssignmentHistory,
      );
      const userGroupPermissionRepo = tx.getRepository(
        UserGroupPermissionAssignment,
      );
      const userGroupSettingRepo = tx.getRepository(UserGroupSetting);

      // Create group
      const group = await groupRepo.save(
        groupRepo.create({
          ...createGroupInput,
          currentStatus: GroupCurrentStatus.CREATED,
          lastStatusUpdatedAt: timeNow,
          companyName: createGroupInput.companyName ?? '',
        }),
      );

      const userGroupAssign = userGroupAssignmentRepo.create({
        userId: ctx.user.userId,
        groupId: group.groupId,
        currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
        userGroupRoleName: '',
        lastStatusUpdatedAt: timeNow,
        isAdmin: true,
        userGroupRoleTemplateId: userRole.userGroupRoleTemplateId,
      });

      // Create user group assignment
      await userGroupAssignmentRepo.insert(userGroupAssign);

      // Create user group assignment history
      await userGroupAssignmentHistoryRepo.insert({
        ...userGroupAssign,
        eventType: UserGroupAssignmentHistoryEventType.ASSIGNED,
        eventAt: timeNow,
        actionedByUserId: ctx.user.userId,
      });

      // Create user group setting
      await userGroupSettingRepo.insert(
        userGroupSettingRepo.create({
          userId: ctx.user.userId,
          groupId: group.groupId,
        }),
      );

      // Create user group permission assignments
      await userGroupPermissionRepo.insert(
        userGroupPermissionRepo.create(
          userRole.userGroupRoleTemplatePermissionAssignments.map(
            (permission) => ({
              userId: ctx.user.userId,
              groupId: group.groupId,
              permissionId: permission.permissionId,
              assignedAt: timeNow,
            }),
          ),
        ),
      );

      // Create group history
      await groupHistoryRepo.insert(
        groupHistoryRepo.create({
          ...createGroupInput,
          eventType: GroupHistoryEventType.CREATE,
          actionedByUserId: ctx.user.userId,
          groupId: group.groupId,
          eventAt: timeNow,
          currentStatus: GroupCurrentStatus.CREATED,
          companyName: createGroupInput.companyName ?? '',
        }),
      );

      return group;
    });

    return plainToInstance(GroupOutput, group);
  }

  async inviteUserToGroup(
    ctx: RequestContext,
    params: GroupParam,
    groupInviteUserInput: GroupInviteUserInput,
  ): Promise<BaseApiResponse<GroupInvitationOutput>> {
    this.logger.log(ctx, `${this.inviteUserToGroup.name} was called`);

    const {
      inviteeUserId,
      userGroupRoleName,
      isAdmin,
      userGroupRoleTemplateId,
    } = groupInviteUserInput;
    const {
      user: { userId },
      isoLocaleCode,
    } = ctx;
    const permissionIds = groupInviteUserInput.permissionIds ?? [];

    // Check request assignment permissions
    await this.checkUserAssignmentPermissions(
      isAdmin,
      permissionIds,
      isoLocaleCode,
      userGroupRoleTemplateId,
    );

    // Get invitee user information
    const inviteeUser = await this.userRepository.getUserInvitee(
      inviteeUserId,
      params.groupId,
    );

    // Check invitee user
    this.checkInviteeUser(inviteeUser, isoLocaleCode, this.i18n);

    const timeNow = new Date();

    const groupInvitation = await this.dataSource.transaction(async (tx) => {
      // Create new invitation
      const groupInvitation = await this.createGroupInvitation(
        tx,
        params.groupId,
        userId,
        groupInviteUserInput,
        timeNow,
        userGroupRoleTemplateId,
      );

      // Accept the invitation to join the group
      const [groupAssignment] = inviteeUser.userGroupAssignments;
      if (
        groupAssignment &&
        groupAssignment.currentStatus ===
          UserGroupAssignmentCurrentStatus.UNASSIGNED
      ) {
        // Reassign user already in the group
        await this.reassignUserToGroup(
          tx,
          groupAssignment,
          userGroupRoleName,
          permissionIds,
          timeNow,
          isAdmin,
          userId,
          userGroupRoleTemplateId,
        );
      } else {
        // Assignment user to group
        await this.assignUserToGroup(
          tx,
          params.groupId,
          inviteeUserId,
          userGroupRoleName,
          permissionIds,
          timeNow,
          isAdmin,
          userId,
          userGroupRoleTemplateId,
        );
      }

      return groupInvitation;
    });

    return {
      data: plainToInstance(GroupInvitationOutput, groupInvitation),
      meta: {
        successMessage: this.i18n.t('message.group.inviteSuccess', {
          lang: isoLocaleCode,
        }),
      },
    };
  }

  async checkUserAssignmentPermissions(
    isAdmin: boolean,
    permissionIds: string[],
    isoLocaleCode: ISOLocaleCode,
    userGroupRoleTemplateId: string,
  ): Promise<void> {
    // Get assignment permissions by id
    const permission = await this.permissionRepository.getPermissionByIds(
      permissionIds,
    );

    // permissionIds contains invalid permissions
    if (permission.length !== permissionIds.length) {
      throw new BadRequestException('PermissionId is invalid.');
    }

    if (isAdmin) {
      const roleTemplate =
        await this.userGroupRoleTemplateRepository.getTemplateRoleManager(
          isoLocaleCode,
        );

      // userGroupRoleTemplate manager is invalid
      if (!roleTemplate) {
        throw new BadRequestException(
          'UserGroupRoleTemplate manager is invalid.',
        );
      }

      if (roleTemplate.userGroupRoleTemplateId !== userGroupRoleTemplateId) {
        throw new BadRequestException('UserGroupRoleTemplateId is invalid.');
      }

      // Check permissions for admin role
      const {
        userGroupRoleTemplatePermissionAssignments: permissionAssignments,
      } = roleTemplate;
      if (permissionIds.length !== permissionAssignments.length) {
        throw new BadRequestException('Admin role information is invalid.');
      }
    }
  }

  async getGroupCandidateUsers(
    ctx: RequestContext,
    groupId: string,
    search: string,
  ): Promise<GroupCandidateUserOutput[]> {
    this.logger.log(ctx, `${this.getGroupCandidateUsers.name} was called`);

    if (!search) {
      const users = await this.userRepository.userCandidateSuggestions(
        groupId,
        ctx.user.userId,
      );

      return plainToInstance(
        GroupCandidateUserOutput,
        users.map((user) => ({
          ...user,
          pictureUrl: this.storageService.generateSasUrl(user.pictureUrl),
        })),
      );
    }

    if (
      EMAIL_REGEX.test(search) ||
      (search.length === SEARCH_ID_LENGTH && isNumberString(search))
    ) {
      const users = await this.userRepository.getGroupCandidateUserBySearch(
        groupId,
        search,
      );

      return plainToInstance(
        GroupCandidateUserOutput,
        users.map((user) => ({
          ...user,
          pictureUrl: this.storageService.generateSasUrl(user.pictureUrl),
        })),
      );
    }

    return [];
  }

  checkInviteeUser(
    inviteeUser: User,
    isoLocaleCode: ISOLocaleCode,
    i18n: I18nService,
  ) {
    // The invitee user does not exist in system or has been deleted
    checkUserNotFound(inviteeUser, isoLocaleCode, i18n, HttpStatus.BAD_REQUEST);

    //The user has been invitee or is already in the group
    const [groupAssignment] = inviteeUser.userGroupAssignments;
    if (
      (groupAssignment &&
        groupAssignment.currentStatus ===
          UserGroupAssignmentCurrentStatus.ASSIGNED) ||
      inviteeUser.groupInvitees.length
    ) {
      throw new BadRequestException({
        customMessage: this.i18n.t('message.group.memberRegistered', {
          lang: isoLocaleCode,
        }),
      });
    }
  }

  async createGroupInvitation(
    tx: EntityManager,
    groupId: string,
    userId: string,
    groupInviteUserInput: GroupInviteUserInput,
    timeNow: Date,
    userGroupRoleTemplateId: string,
  ) {
    const { inviteeUserId, userGroupRoleName } = groupInviteUserInput;
    const permissionIds = groupInviteUserInput.permissionIds ?? [];
    const groupInvitationRepo = tx.getRepository(GroupInvitation);
    const userGroupInvitationPermissionRepo = tx.getRepository(
      UserGroupPermissionInvitation,
    );

    // Create group invitation
    const groupInvitation = await groupInvitationRepo.save(
      groupInvitationRepo.create({
        groupId: groupId,
        inviterUserId: userId,
        invitedAt: timeNow,
        invitationType: InvitationType.EXISTING_USER_INVITE,
        inviteeUserId,
        userGroupRoleName,
        userGroupRoleTemplateId,

        // Assign to the group immediately after being invited
        invitationResponse: InvitationResponse.ACCEPTED,
        respondedAt: timeNow,
      }),
    );

    // Create group invitation permission
    await userGroupInvitationPermissionRepo.save(
      userGroupInvitationPermissionRepo.create(
        permissionIds.map((permissionId) => ({
          groupInvitationId: groupInvitation.groupInvitationId,
          invitedAt: timeNow,
          permissionId,
        })),
      ),
    );

    return groupInvitation;
  }

  async reassignUserToGroup(
    tx: EntityManager,
    groupAssignment: UserGroupAssignment,
    userGroupRoleName: string,
    permissionIds: string[],
    timeNow: Date,
    isAdmin: boolean,
    currentUserId: string,
    userGroupRoleTemplateId: string,
  ) {
    const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);
    const userGroupPermissionRepo = tx.getRepository(
      UserGroupPermissionAssignment,
    );
    const userGroupAssignmentHistoryRepo = tx.getRepository(
      UserGroupAssignmentHistory,
    );

    const userGroupAssign = userGroupAssignmentRepo.create({
      ...groupAssignment,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: userGroupRoleName,
      lastStatusUpdatedAt: timeNow,
      isAdmin: isAdmin,
      userGroupRoleTemplateId: userGroupRoleTemplateId,
    });

    const { userId, groupId } = groupAssignment;

    // Re-assign group current status
    // Update user group assignment
    await userGroupAssignmentRepo.update({ userId, groupId }, userGroupAssign);

    // Create user group assignment histories
    await userGroupAssignmentHistoryRepo.insert({
      ...userGroupAssign,
      eventType: UserGroupAssignmentHistoryEventType.ASSIGNED,
      eventAt: timeNow,
      actionedByUserId: currentUserId,
    });

    // Delete old permission assignments
    await userGroupPermissionRepo.delete({
      userId: groupAssignment.userId,
      groupId: groupAssignment.groupId,
    });

    // Create user group permission assignments
    await userGroupPermissionRepo.save(
      userGroupPermissionRepo.create(
        permissionIds.map((permissionId) => ({
          userId: groupAssignment.userId,
          groupId: groupAssignment.groupId,
          permissionId,
          assignedAt: timeNow,
        })),
      ),
    );
  }

  async assignUserToGroup(
    tx: EntityManager,
    groupId: string,
    inviteeUserId: string,
    userGroupRoleName: string,
    permissionIds: string[],
    timeNow: Date,
    isAdmin: boolean,
    currentUserId: string,
    userGroupRoleTemplateId: string,
  ) {
    const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);
    const userGroupPermissionRepo = tx.getRepository(
      UserGroupPermissionAssignment,
    );
    const userGroupSettingRepo = tx.getRepository(UserGroupSetting);
    const userGroupAssignmentHistoryRepo = tx.getRepository(
      UserGroupAssignmentHistory,
    );

    const userGroupAssign = userGroupAssignmentRepo.create({
      userId: inviteeUserId,
      groupId: groupId,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      userGroupRoleName: userGroupRoleName,
      lastStatusUpdatedAt: timeNow,
      isAdmin: isAdmin,
      userGroupRoleTemplateId: userGroupRoleTemplateId,
    });

    // Assign to the group immediately after being invited
    // Create user group assignment
    await userGroupAssignmentRepo.insert(userGroupAssign);

    // Create user group assignment histories
    await userGroupAssignmentHistoryRepo.insert({
      ...userGroupAssign,
      eventType: UserGroupAssignmentHistoryEventType.ASSIGNED,
      eventAt: timeNow,
      actionedByUserId: currentUserId,
    });

    // Create user group setting
    await userGroupSettingRepo.insert(
      userGroupSettingRepo.create({
        userId: inviteeUserId,
        groupId: groupId,
      }),
    );

    // Create user group permission assignments
    await userGroupPermissionRepo.insert(
      userGroupPermissionRepo.create(
        permissionIds.map((permissionId) => ({
          userId: inviteeUserId,
          groupId: groupId,
          permissionId,
          assignedAt: timeNow,
        })),
      ),
    );
  }

  async getUserPermissionInGroup(
    ctx: RequestContext,
    params: GroupParam,
  ): Promise<PermissionInGroupOutput> {
    this.logger.log(ctx, `${this.getUserPermissionInGroup.name} was called`);
    const groupPermissions =
      await this.userGroupAssignmentRepository.getUserGroupAssignmentPermissions(
        ctx.user.userId,
        params.groupId,
      );

    if (!groupPermissions) {
      throw new ForbiddenException(
        'You do not have permission to access this group.',
      );
    }

    const permission = {
      userId: groupPermissions.userId,
      groupId: groupPermissions.groupId,
      permissions: groupPermissions.userGroupPermissionAssignments.reduce(
        (acc, permissionAssignment) => {
          acc[permissionAssignment.permission.resource.resourceCode] =
            permissionAssignment.permission.operation.operationCode;
          return acc;
        },
        {},
      ),
    };

    return plainToInstance(PermissionInGroupOutput, permission);
  }

  async deleteUserInGroup(ctx: RequestContext, params: GroupUserParam) {
    this.logger.log(ctx, `${this.deleteUserInGroup.name} was called`);
    const { groupId, userId } = params;

    // Check user does't delete yourself
    if (userId === ctx.user.userId) {
      throw new BadRequestException({
        customMessage: this.i18n.t('message.group.deleteYourself', {
          lang: ctx.isoLocaleCode,
        }),
      });
    }

    const timeNow = new Date();
    await this.dataSource.transaction(async (tx) => {
      const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);

      // Update the user's current status in the group to `UNASSIGNED`
      await userGroupAssignmentRepo.save(
        userGroupAssignmentRepo.create({
          userId,
          groupId,
          lastStatusUpdatedAt: timeNow,
          currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
        }),
      );
    });
  }

  async updateArchiveStatusUserGroup(
    ctx: RequestContext,
    groupsUserArchiveStatusInput: GroupsUserArchiveStatusInput,
  ): Promise<BaseApiResponse<object>> {
    this.logger.log(
      ctx,
      `${this.updateArchiveStatusUserGroup.name} was called`,
    );

    const { groupIds, isArchived } = groupsUserArchiveStatusInput;
    const userId = ctx.user.userId;
    await this.checkListGroupPermission(ctx, groupIds, userId);

    await this.userGroupSettingRepository.update(
      { userId, groupId: In(groupIds) },
      { isArchived: isArchived ?? false },
    );

    return {
      data: {},
      meta: {
        successMessage: this.i18n.t(
          `message.group.${isArchived ? 'archiveSuccess' : 'unarchiveSuccess'}`,
          {
            lang: ctx.isoLocaleCode,
          },
        ),
      },
    };
  }

  async getUserAssignmentInfo(
    ctx: RequestContext,
    params: GroupUserParam,
  ): Promise<UserAssignmentInfoOutput> {
    this.logger.log(ctx, `${this.getUserAssignmentInfo.name} was called`);

    const { userId, groupId } = params;
    const { isoLocaleCode } = ctx;

    //Check user info in group assignment
    const user = await this.userRepository.getUserGroupAssignment(
      userId,
      groupId,
    );

    const userAssignmentInfo =
      await this.userGroupRoleTemplateRepository.getUserAssignmentInfo(
        isoLocaleCode,
        userId,
        groupId,
      );

    const response = {
      userId: userId,
      givenName: user.givenName,
      surname: user.surname,
      groupId: groupId,
      roleName: user.userGroupAssignments[0].userGroupRoleName,
      permissions:
        userAssignmentInfo[0].userGroupRoleTemplatePermissionAssignments.map(
          (adminPermission) => ({
            ...adminPermission.permission.permissionTranslations[0],
            isChecked:
              adminPermission.permission.userGroupPermissionAssignments.length >
              0,
          }),
        ),

      isAdmin: user.userGroupAssignments[0].isAdmin,
      userGroupRoleTemplateId:
        user.userGroupAssignments[0].userGroupRoleTemplateId,
    };

    return plainToInstance(UserAssignmentInfoOutput, response);
  }

  async updateGroup(
    ctx: RequestContext,
    groupId: string,
    input: UpdateGroupInput,
    groupContext: Group,
  ): Promise<UpdateGroupOutput> {
    this.logger.log(ctx, `${this.updateGroup.name} was called`);

    const group = await this.dataSource.transaction(async (tx) => {
      const updateAt = new Date();
      const groupRepo = tx.getRepository(Group);
      const groupHistoryRepo = tx.getRepository(GroupHistory);

      const group = groupRepo.create({
        ...groupContext,
        ...input,
        currentStatus: GroupCurrentStatus.UPDATED,
        lastStatusUpdatedAt: updateAt,
      });

      await groupHistoryRepo.insert({
        ...group,
        actionedByUserId: ctx.user.userId,
        eventType: GroupHistoryEventType.UPDATE,
        eventAt: updateAt,
      });

      await groupRepo.update(groupId, group);

      return group;
    });

    return plainToInstance(UpdateGroupOutput, group);
  }

  async deleteGroups(
    ctx: RequestContext,
    groupIds: string[],
  ): Promise<BaseApiResponse<object>> {
    this.logger.log(ctx, `${this.deleteGroups.name} was called`);

    const userId = ctx.user.userId;
    const groups = await this.checkListGroupPermission(ctx, groupIds, userId);

    const checkUserPermissionInGroup =
      await this.userGroupAssignmentRepository.getUserPermissionInGroups(
        groupIds,
        userId,
      );

    if (checkUserPermissionInGroup.length !== groupIds.length) {
      throw new ForbiddenException({
        message: 'User does not have permission to delete.',
      });
    }

    await this.dataSource.transaction(async (tx) => {
      const updatedAt = new Date();
      const groupRepo = tx.getRepository(Group);
      const groupHistoryRepo = tx.getRepository(GroupHistory);
      const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);
      const userGroupAssignmentHistoryRepo = tx.getRepository(
        UserGroupAssignmentHistory,
      );
      const machineRepo = tx.getRepository(Machine);
      const machineHistoryRepo = tx.getRepository(MachineHistory);

      // Soft delete groups
      await groupRepo.update(
        groupIds,
        groupRepo.create({
          currentStatus: GroupCurrentStatus.DELETED,
          lastStatusUpdatedAt: updatedAt,
        }),
      );

      // Create group history
      await groupHistoryRepo.insert(
        groups.map((group) => ({
          ...group,
          eventType: GroupHistoryEventType.DELETE,
          eventAt: updatedAt,
          actionedByUserId: userId,
          currentStatus: GroupCurrentStatus.DELETED,
        })),
      );

      const userGroupAssignments = await userGroupAssignmentRepo.find({
        where: {
          groupId: In(groupIds),
          currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
        },
      });

      //Update status unassigned for users in group
      await userGroupAssignmentRepo.update(
        {
          groupId: In(groupIds),
          currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
        },
        {
          currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
          lastStatusUpdatedAt: updatedAt,
        },
      );

      // Create user group assignment history
      await userGroupAssignmentHistoryRepo.insert(
        userGroupAssignments.map((userGroupAssignment) => ({
          ...userGroupAssignment,
          eventType: UserGroupAssignmentHistoryEventType.UNASSIGNED,
          eventAt: updatedAt,
          actionedByUserId: userId,
          currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
        })),
      );

      const machines = await machineRepo.find({
        where: {
          groupId: In(groupIds),
          currentStatus: Not(MachineCurrentStatus.DELETED),
        },
      });

      // Soft delete machine
      await machineRepo.update(
        {
          groupId: In(groupIds),
          currentStatus: Not(MachineCurrentStatus.DELETED),
        },
        {
          lastStatusUpdatedAt: updatedAt,
          currentStatus: MachineCurrentStatus.DELETED,
        },
      );

      // Create machine history
      await machineHistoryRepo.insert(
        machines.map((machine) => ({
          ...machine,
          eventType: EventType.DELETE,
          eventAt: updatedAt,
          actionedByUserId: userId,
          currentStatus: MachineCurrentStatus.DELETED,
        })),
      );
    });

    return {
      data: {},
      meta: {
        successMessage: this.i18n.t('message.group.deleteSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  async updateUserGroupAssignment(
    ctx: RequestContext,
    params: GroupUserParam,
    userGroupAssignmentUpdateInput: UserGroupAssignmentUpdateInput,
  ): Promise<UserGroupAssignmentOutput> {
    this.logger.log(ctx, `${this.updateUserGroupAssignment.name} was called`);

    const { userId, groupId } = params;
    const { isoLocaleCode } = ctx;
    const permissionIds = userGroupAssignmentUpdateInput.permissionIds;
    const { userGroupRoleName, isAdmin, userGroupRoleTemplateId } =
      userGroupAssignmentUpdateInput;

    // Check request assignment permissions
    await this.checkUserAssignmentPermissions(
      isAdmin,
      permissionIds,
      isoLocaleCode,
      userGroupRoleTemplateId,
    );

    const timeNow = new Date();

    // Update transaction
    const userGroupAssignment = await this.dataSource.transaction(
      async (tx) => {
        const userGroupAssignmentRepo = tx.getRepository(UserGroupAssignment);
        const userGroupPermissionRepo = tx.getRepository(
          UserGroupPermissionAssignment,
        );
        const userGroupAssignmentHistoryRepo = tx.getRepository(
          UserGroupAssignmentHistory,
        );

        // Update user group assignment
        const userGroupAssignment = await userGroupAssignmentRepo.save(
          userGroupAssignmentRepo.create({
            userId,
            groupId: groupId,
            lastStatusUpdatedAt: timeNow,
            userGroupRoleName,
            isAdmin: !!isAdmin,
            userGroupRoleTemplateId: userGroupRoleTemplateId,
          }),
        );

        // Create user group assignment history
        await userGroupAssignmentHistoryRepo.insert(
          userGroupAssignmentHistoryRepo.create({
            ...userGroupAssignment,
            eventType: UserGroupAssignmentHistoryEventType.ASSIGNED,
            eventAt: timeNow,
            actionedByUserId: userId,
            currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
          }),
        );

        // Delete user's permissions in group
        await userGroupPermissionRepo.delete({
          userId,
          groupId,
        });

        // Create user group permission assignments
        await userGroupPermissionRepo.save(
          userGroupPermissionRepo.create(
            permissionIds.map((permissionId) => ({
              userId,
              groupId,
              permissionId,
              assignedAt: timeNow,
            })),
          ),
        );

        return userGroupAssignment;
      },
    );

    return plainToInstance(UserGroupAssignmentOutput, userGroupAssignment);
  }

  async updateMachineFavoriteStatus(
    ctx: RequestContext,
    params: GroupMachineParam,
  ): Promise<MachineFavoriteOutput> {
    this.logger.log(ctx, `${this.updateMachineFavoriteStatus.name} was called`);
    const { groupId, machineId } = params;
    const userId = ctx.user.userId;

    const favoriteStatus = await this.dataSource.transaction(async (tx) => {
      const userGroupMachineFavoriteRepo = tx.getRepository(
        UserGroupMachineFavorite,
      );

      const deletedFavorite = await userGroupMachineFavoriteRepo.delete({
        userId,
        groupId,
        machineId,
      });

      // If it's not a favorite, add it
      if (!deletedFavorite.affected) {
        await userGroupMachineFavoriteRepo.insert({
          userId,
          groupId,
          machineId,
        });

        return {
          status: MachineFavoriteResponse.CREATED,
        };
      }

      return {
        status: MachineFavoriteResponse.DELETED,
      };
    });

    return plainToInstance(MachineFavoriteOutput, favoriteStatus);
  }

  async getGroupDetailInfo(
    ctx: RequestContext,
    params: GroupParam,
  ): Promise<GroupDetailInfoOutput> {
    this.logger.log(ctx, `${this.getGroupDetailInfo.name} was called`);

    const { groupId } = params;
    const userId = ctx.user.userId;

    const groupDetailInfo = await this.repository.getGroupDetailById(
      groupId,
      userId,
    );

    return plainToInstance(GroupDetailInfoOutput, groupDetailInfo);
  }

  async checkListGroupPermission(
    ctx: RequestContext,
    groupIds: string[],
    userId: string,
  ): Promise<Group[]> {
    const groups = await this.repository.getListGroupByIds(groupIds, userId);

    if (groups.length !== groupIds.length) {
      throw new BadRequestException(
        'The groupId list contains invalid groupId.',
      );
    }

    if (
      groups.some((group) => group.currentStatus === GroupCurrentStatus.DELETED)
    ) {
      throw new BadRequestException({
        message: 'The group list contains the deleted group.',
        customMessage: this.i18n.t('message.group.existingDelete', {
          lang: ctx.isoLocaleCode,
        }),
        errorType: ErrorType.GROUP_NOT_FOUND,
      });
    }

    if (groups.some((group) => !group.userGroupAssignments.length)) {
      throw new ForbiddenException(
        'Cannot operate on at least one of the selected groups.',
      );
    }

    return groups;
  }

  async getMachinesInGroup(
    ctx: RequestContext,
    params: GroupParam,
  ): Promise<GetMachinesInGroupOutput> {
    this.logger.log(ctx, `${this.getMachinesInGroup.name} was called`);

    const { groupId } = params;
    const {
      user: { userId },
      isoLocaleCode,
    } = ctx;

    const [machines, countMachineReports] = await Promise.all([
      this.machineRepository.getMachinesInGroup(groupId, userId, isoLocaleCode),
      this.machineRepository.countMachineReport(groupId),
    ]);

    const countMachineReportMap = new Map<string, number>(
      countMachineReports.map((countMachineReport) => [
        countMachineReport.machineId,
        countMachineReport.machineReportCount,
      ]),
    );

    return plainToInstance(
      GetMachinesInGroupOutput,
      machines.reduce(
        (acc, machine) => {
          const baseMachine = {
            ...machine,
            machineManufacturerName:
              machine.customMachineManufacturerName ||
              machine.machineManufacturerName,
            isFavorite: !!machine.userId,
            machineCondition: machine.machineCondition,
            pictureUrl: this.storageService.generateSasUrl(
              machine.pictureUrl || machine.machineTypePictureUrl,
            ),
            machineReportCount:
              countMachineReportMap.get(machine.machineId) ?? 0,
          };

          (baseMachine.isFavorite
            ? acc.favoriteMachines
            : acc.unFavoriteMachines
          ).push(baseMachine);

          return acc;
        },
        { favoriteMachines: [], unFavoriteMachines: [] },
      ),
    );
  }

  async assignMachineIntoGroup(
    ctx: RequestContext,
    params: GroupParam,
    body: MachinesAssignIntoGroupInput,
  ): Promise<BaseApiResponse<object>> {
    this.logger.log(ctx, `${this.assignMachineIntoGroup.name} was called`);

    const groupId = params.groupId;
    const machineIds = body.machineIds;
    const userId = ctx.user.userId;

    const machines = await this.checkListMachineIds(ctx, machineIds, groupId);

    const timeNow = new Date();
    // transaction
    await this.dataSource.transaction(async (tx) => {
      const machineRepo = tx.getRepository(Machine);
      const machineConditionRepo = tx.getRepository(MachineCondition);
      const machineConditionHistoryRepo = tx.getRepository(
        MachineConditionHistory,
      );
      const machineHistoryRepo = tx.getRepository(MachineHistory);

      // Create machine duplicate info machines input
      const duplicateMachines = await machineRepo.save(
        machineRepo.create(
          machines.map((machine) => ({
            ...machine,
            machineId: ulid(),
            groupId,
            lastStatusUpdatedAt: timeNow,
          })),
        ),
      );

      // Create machine history
      await machineHistoryRepo.insert(
        duplicateMachines.map((machine) => ({
          ...machine,
          eventType: EventType.CREATE,
          eventAt: timeNow,
          actionedByUserId: ctx.user.userId,
          currentStatus: MachineCurrentStatus.CREATED,
          groupId,
        })),
      );

      // Create machine condition
      await machineConditionRepo.insert(
        duplicateMachines.map(({ machineId }) => ({
          machineId,
          machineCondition: GroupMachineCondition.NORMAL,
          userId: userId,
        })),
      );

      // Create machine condition history
      await machineConditionHistoryRepo.insert(
        duplicateMachines.map(({ machineId }) => ({
          machineId,
          machineCondition: GroupMachineCondition.NORMAL,
          actionedByUserId: userId,
          eventType: EventType.CREATE,
        })),
      );
    });

    return {
      data: {},
      meta: {
        successMessage: this.i18n.t('message.group.addMachineSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  async checkListMachineIds(
    ctx: RequestContext,
    machineIds: string[],
    groupId: string,
  ): Promise<Machine[]> {
    const machines = await this.machineRepository.getMachinesByMachineIds(
      machineIds,
      groupId,
    );
    if (machineIds.length !== machines.length) {
      throw new BadRequestException({
        message: 'The machineId list contains invalid machineId.',
        errorType: ErrorType.MACHINE_NOT_FOUND,
      });
    }

    const mapMachine = {};
    const machineNames = [];

    for (const machine of machines) {
      const { serialNumber, modelAndType, currentStatus, machineName, count } =
        machine;

      // Check for deleted machines
      if (currentStatus === MachineCurrentStatus.DELETED) {
        throw new BadRequestException({
          message: 'The machine list contains the deleted machine.',
          customMessage: this.i18n.t('message.group.existingDelete', {
            lang: ctx.isoLocaleCode,
          }),
          errorType: ErrorType.MACHINE_NOT_FOUND,
        });
      }

      // Check for duplicate serialNumber and modelAndType
      if (!mapMachine[serialNumber]) {
        mapMachine[serialNumber] = {};
      }

      if (!mapMachine[serialNumber][modelAndType]) {
        mapMachine[serialNumber][modelAndType] = true;
      } else {
        throw new BadRequestException(
          'The machineId list contains duplicate serialNumber and modelAndType.',
        );
      }

      if (count > 0) {
        machineNames.push(machineName);
      }
    }

    if (machineNames.length > 0) {
      throw new BadRequestException({
        customMessage: this.i18n.t(
          'message.group.sameSerialNumberAndModelAndType',
          {
            lang: ctx.isoLocaleCode,
            args: { machineName: machineNames.join(', ') },
          },
        ),
      });
    }

    return machines;
  }

  async createMachineInGroup(
    ctx: RequestContext,
    params: GroupParam,
    machineInput: MachineInput,
  ): Promise<MachineOutput> {
    this.logger.log(ctx, `${this.createMachineInGroup.name} was called`);

    const { groupId } = params;

    //Check machine relations and get machine type
    const machineType = await this.checkMachineRelations(
      ctx,
      params as GroupMachineParam,
      machineInput,
    );

    // Create transaction
    const machine = await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const machineRepo = tx.getRepository(Machine);
      const machineHistoryRepo = tx.getRepository(MachineHistory);
      const machineConditionRepo = tx.getRepository(MachineCondition);
      const machineConditionHistoryRepo = tx.getRepository(
        MachineConditionHistory,
      );

      // Create machine
      const machine = await machineRepo.save(
        machineRepo.create({
          ...machineInput,
          pictureUrl: machineInput.pictureUrl ?? '',
          serialNumberPlatePictureUrl:
            machineInput.serialNumberPlatePictureUrl ?? '',
          currentStatus: MachineCurrentStatus.CREATED,
          lastStatusUpdatedAt: timeNow,
          groupId,
        }),
      );

      // Create machine history
      await machineHistoryRepo.save(
        machineHistoryRepo.create({
          ...machineInput,
          eventType: EventType.CREATE,
          eventAt: timeNow,
          actionedByUserId: ctx.user.userId,
          machineId: machine.machineId,
          currentStatus: MachineCurrentStatus.CREATED,
          pictureUrl: machineInput.pictureUrl ?? '',
          serialNumberPlatePictureUrl:
            machineInput.serialNumberPlatePictureUrl ?? '',
          groupId,
        }),
      );

      // Create machine condition
      await machineConditionRepo.insert({
        machineId: machine.machineId,
        machineCondition: GroupMachineCondition.NORMAL,
        userId: ctx.user.userId,
      });

      // Create machine condition history
      await machineConditionHistoryRepo.insert({
        eventType: EventType.CREATE,
        machineId: machine.machineId,
        machineCondition: GroupMachineCondition.NORMAL,
        actionedByUserId: ctx.user.userId,
      });

      return machine;
    });

    return plainToInstance(MachineOutput, {
      ...machine,
      pictureUrl: this.storageService.generateSasUrl(
        machine.pictureUrl || machineType.pictureUrl,
      ),
      serialNumberPlatePictureUrl: this.storageService.generateSasUrl(
        machine.serialNumberPlatePictureUrl,
      ),
    });
  }

  async getGroupAvailableMachines(
    ctx: RequestContext,
    groupId: string,
    search: string,
  ): Promise<GroupAvailableMachineOutput[]> {
    this.logger.log(ctx, `${this.getGroupAvailableMachines.name} was called`);

    search = search ? search.replace(WILDCARD_REGEX, `${ESCAPE_CHAR}$1`) : '';

    const machines = await this.machineRepository.groupMachineSuggestions(
      groupId,
      ctx.user.userId,
      search,
      MACHINE_SUGGESTION_LIMIT,
    );

    return plainToInstance(
      GroupAvailableMachineOutput,
      machines.map((machine) => ({
        ...machine,
        machineManufacturerName:
          machine.customMachineManufacturerName ||
          machine.machineManufacturerName,
        pictureUrl: this.storageService.generateSasUrl(
          machine.pictureUrl || machine.machineTypePictureUrl,
        ),
        isAlreadyInGroup: machine.groupId === groupId,
      })),
    );
  }

  async getMachineDetailInfo(
    ctx: RequestContext,
    params: GroupMachineParam,
  ): Promise<MachineDetailInfoOutput> {
    this.logger.log(ctx, `${this.getMachineDetailInfo.name} was called`);

    const {
      user: { userId },
      isoLocaleCode,
    } = ctx;
    const { groupId, machineId } = params;

    const machineDetailInfo = await this.machineRepository.getMachineDetailInfo(
      userId,
      groupId,
      machineId,
      isoLocaleCode,
    );

    return plainToInstance(MachineDetailInfoOutput, {
      ...machineDetailInfo,
      pictureUrl: this.storageService.generateSasUrl(
        machineDetailInfo.pictureUrl ||
          machineDetailInfo.machineType.pictureUrl,
      ),
      machineTypeName:
        machineDetailInfo.machineType.machineTypeTranslation.typeName,
      isFavorite: !!machineDetailInfo.userGroupMachineFavorites.length,
      machineManufacturerName:
        machineDetailInfo.machineManufacturer.machineManufacturerName,
      serialNumberPlatePictureUrl: this.storageService.generateSasUrl(
        machineDetailInfo.serialNumberPlatePictureUrl,
      ),
      machineCondition:
        machineDetailInfo.groupMachineCondition?.machineCondition,
      filePath: machineDetailInfo.pictureUrl,
      serialNumberFilePath: machineDetailInfo.serialNumberPlatePictureUrl,
      isOtherMachineManufacturer:
        machineDetailInfo.machineManufacturer.machineManufacturerName ===
        MACHINE_MANUFACTURER_NAME_CUSTOM,
      isOtherMachineType:
        machineDetailInfo.machineType.machineTypeCode ===
        MACHINE_TYPE_CODE_CUSTOM,
    });
  }

  async updateMachineInGroup(
    ctx: RequestContext,
    params: GroupMachineParam,
    input: UpdateMachineInGroupInput,
  ) {
    this.logger.log(ctx, `${this.updateMachineInGroup.name} was called`);

    const { groupId, machineId } = params;

    const machine = await this.machineRepository.getMachineInGroupById(
      groupId,
      machineId,
    );

    //Check machine relations and get machine type
    const machineType = await this.checkMachineRelations(ctx, params, input);

    const timeNow = new Date();
    const updatedMachine = await this.dataSource.transaction(async (tx) => {
      const machineRepo = tx.getRepository(Machine);
      const machineHistoryRepo = tx.getRepository(MachineHistory);

      const updateMachine = machineRepo.create({
        ...machine,
        ...input,
        currentStatus: MachineCurrentStatus.UPDATED,
        lastStatusUpdatedAt: timeNow,
      });

      // Update machine
      await machineRepo.update(machineId, updateMachine);

      // Create machine history
      await machineHistoryRepo.insert(
        machineHistoryRepo.create({
          ...updateMachine,
          eventType: EventType.UPDATE,
          eventAt: timeNow,
          actionedByUserId: ctx.user.userId,
        }),
      );

      return updateMachine;
    });

    return plainToInstance(MachineOutput, {
      ...updatedMachine,
      pictureUrl: this.storageService.generateSasUrl(
        updatedMachine.pictureUrl || machineType.pictureUrl,
      ),
      serialNumberPlatePictureUrl: this.storageService.generateSasUrl(
        updatedMachine.serialNumberPlatePictureUrl,
      ),
    });
  }

  async checkMachineRelations(
    ctx: RequestContext,
    params: GroupMachineParam,
    input: UpdateMachineInGroupInput,
  ) {
    const { groupId, machineId } = params;

    const {
      machineManufacturerId,
      machineTypeId,
      customMachineManufacturerName,
      customTypeName,
      serialNumber,
    } = input;

    const existingMachineInGroup =
      await this.machineRepository.getMachineInGroup(
        groupId,
        input.serialNumber,
        input.modelAndType,
      );

    if (
      machineId
        ? existingMachineInGroup &&
          existingMachineInGroup.machineId !== machineId
        : existingMachineInGroup
    ) {
      throw new BadRequestException({
        customMessage: this.i18n.t('message.group.existingMachine', {
          lang: ctx.isoLocaleCode,
        }),
      });
    }

    const machineManufacturer =
      await this.machineManufacturerRepository.findOne({
        where: { machineManufacturerId },
      });

    if (!machineManufacturer) {
      throw new BadRequestException('Machine manufacturer ID invalid.');
    }

    const machineType = await this.machineTypeRepository.findOne({
      where: { machineTypeId },
    });

    if (!machineType) {
      throw new BadRequestException('Machine type ID invalid.');
    }

    // validation serial number
    const validationContent = await this.storageFileService.getFileContent(
      SERIAL_NUMBER_VALID_FILE,
    );

    const komatsuId =
      machineManufacturer.machineManufacturerName === MACHINE_MANUFACTURER_KMT
        ? machineManufacturer.machineManufacturerId
        : OTHER_MACHINE_MANUFACTURERS;
    const otherId = [
      ALL_MACHINE_TYPES,
      machineType.machineTypeCode === MACHINE_TYPE_CODE_CUSTOM
        ? machineType.machineTypeId
        : OTHER_MACHINE_TYPES,
    ];

    const validateCase = JSON.parse(validationContent).serialNumber.filter(
      ({ manufacturer, machineType }) =>
        manufacturer === komatsuId && otherId.includes(machineType),
    )[0];

    if (validateCase.maxLength < serialNumber.length) {
      throw new BadRequestException(
        'The serial number exceeds the maximum length.',
      );
    }

    if (!new RegExp(validateCase.regex).test(serialNumber)) {
      throw new BadRequestException({
        customMessage: validateCase.message[ctx.isoLocaleCode],
      });
    }

    if (
      customMachineManufacturerName &&
      machineManufacturer.machineManufacturerName !==
        MACHINE_MANUFACTURER_NAME_CUSTOM
    ) {
      throw new BadRequestException(
        'customMachineManufacturerName is invalid.',
      );
    }

    if (
      customTypeName &&
      machineType.machineTypeCode !== MACHINE_TYPE_CODE_CUSTOM
    ) {
      throw new BadRequestException('customTypeName is invalid.');
    }

    return machineType;
  }

  async updateMachineConditionStatus(
    ctx: RequestContext,
    params: GroupMachineParam,
    input: UpdateMachineConditionInput,
  ): Promise<UpdateMachineConditionOutput> {
    this.logger.log(
      ctx,
      `${this.updateMachineConditionStatus.name} was called`,
    );

    const userId = ctx.user.userId;
    const { machineId } = params;

    const timeNow = new Date();
    await this.dataSource.transaction(async (tx) => {
      const machineConditionRepo = tx.getRepository(MachineCondition);
      const machineConditionHistoryRepo = tx.getRepository(
        MachineConditionHistory,
      );

      // Update machine condition
      await machineConditionRepo.update(machineId, { ...input, userId });

      //Create machine condition history
      await machineConditionHistoryRepo.insert({
        ...input,
        eventType: EventType.UPDATE,
        eventAt: timeNow,
        actionedByUserId: userId,
        machineId,
      });
    });

    return plainToInstance(UpdateMachineConditionOutput, { ...input });
  }

  async deleteMachineInGroup(ctx: RequestContext, params: GroupMachineParam) {
    this.logger.log(ctx, `${this.deleteMachineInGroup.name} was called`);

    const { groupId, machineId } = params;
    const userId = ctx.user.userId;

    const machine = await this.machineRepository.getMachineInGroupById(
      groupId,
      machineId,
    );

    // Create transaction
    await this.dataSource.transaction(async (tx) => {
      const timeNow = new Date();
      const machineRepo = tx.getRepository(Machine);
      const machineHistoryRepo = tx.getRepository(MachineHistory);

      // Soft delete machine
      await machineRepo.update(machineId, {
        currentStatus: MachineCurrentStatus.DELETED,
        lastStatusUpdatedAt: timeNow,
      });

      // Create machine history
      await machineHistoryRepo.insert(
        machineHistoryRepo.create({
          ...machine,
          eventType: EventType.DELETE,
          eventAt: timeNow,
          actionedByUserId: userId,
          currentStatus: MachineCurrentStatus.DELETED,
        }),
      );
    });

    return {
      data: {},
      meta: {
        successMessage: this.i18n.t('message.group.deleteMachineSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  async findGroupsForWebapp(
    ctx: RequestContext,
    query: GetGroupsQuery,
  ): Promise<BaseApiResponse<GetGroupWebappOutput[]>> {
    const userId = ctx.user.userId;
    const { limit, page, orderBys } = query;
    const orderBy = orderBys?.[0] ?? {
      field: GroupSortByField.GROUP_NAME,
      order: Order.ASC,
    };
    const offset = limit ? (page - 1) * limit : 0;

    const countFields = {
      [GroupSortByField.MACHINE_COUNT]: true,
      [GroupSortByField.REPORT_COUNT]: true,
      [GroupSortByField.INSPECTION_FORM_COUNT]: true,
      [GroupSortByField.MEMBER_COUNT]: true,
    };

    const defaultOrderField = countFields[orderBy.field]
      ? orderBy.field
      : GroupSortByField.MEMBER_COUNT;

    delete countFields[defaultOrderField];

    const [total, groupObjects] = await Promise.all([
      this.repository.countGroupForWebapp(userId),
      this.repository.getGroupsForWebapp(userId, offset, limit, orderBy),
    ]);

    const groups = Object.values(groupObjects);

    let resp = [];
    if (groups.length) {
      const groupIds = groups.map((group) => group.groupId);
      const otherFields = Object.keys(countFields) as GroupSortByField[];

      const [permissionGroups, firstCount, secondCount, thirdCount] =
        await Promise.all([
          this.userGroupAssignmentRepository.checkPermissionGroups(
            userId,
            groupIds,
          ),
          ...otherFields.map((field) =>
            this.repository.getGroupsForWebapp(
              userId,
              offset,
              limit,
              { field, order: orderBy.order },
              groupIds,
            ),
          ),
        ]);

      const permissionCodes = permissionGroups.reduce(
        (acc, { groupId, resourceCode, operationCode }) => {
          acc[groupId] ??= {};
          acc[groupId][resourceCode] = operationCode;
          return acc;
        },
        {},
      );

      resp = groups.map((group: Group) => ({
        ...group,
        ...firstCount[group.groupId],
        ...secondCount[group.groupId],
        ...thirdCount[group.groupId],
        permissions: {
          allowEditDeleteGroup:
            permissionCodes[group.groupId]?.[Resource.GROUPS] ===
            Operation.UPDATE_DELETE,
          allowCreateEditDeleteMachine:
            permissionCodes[group.groupId]?.[Resource.MACHINES] ===
            Operation.READ_CREATE_UPDATE_DELETE,
          allowCreateEditDeleteMember:
            permissionCodes[group.groupId]?.[
              Resource.USER_GROUP_ASSIGNMENTS
            ] === Operation.READ_CREATE_UPDATE_DELETE,
          allowCreateEditDeleteInspectionForm:
            permissionCodes[group.groupId]?.[
              Resource.CUSTOM_INSPECTION_FORMS
            ] === Operation.READ_CREATE_UPDATE,
          allowCreateInspectionAndReport:
            permissionCodes[group.groupId]?.[
              Resource.INSPECTIONS_AND_MACHINE_REPORTS
            ] === Operation.READ_CREATE,
        },
      }));
    }

    return {
      data: plainToInstance(GetGroupWebappOutput, resp),
      meta: {
        pageInfo: {
          total,
          page,
          limit,
        },
      },
    };
  }

  async getMachinesInGroupForWebapp(
    ctx: RequestContext,
    params: GroupParam,
    queries: GetMachineInGroupWebappQuery,
  ): Promise<BaseApiResponse<GetMachinesInGroupWebappOutput[]>> {
    this.logger.log(ctx, `${this.getMachinesInGroupForWebapp.name} was called`);
    const { limit, page, orderBys, machineCondition } = queries;
    const { groupId } = params;

    const offset = limit ? (page - 1) * limit : 0;

    const [total, machines] = await Promise.all([
      this.machineRepository.countMachinesInGroupForWebapp(
        machineCondition,
        groupId,
      ),
      this.machineRepository.getMachinesInGroupForWebapp(
        groupId,
        ctx.isoLocaleCode,
        offset,
        limit,
        orderBys,
        machineCondition,
      ),
    ]);

    let response = [];

    if (machines.length) {
      const machineIds = machines.map((machine) => machine.machineId);

      const machineReportCounts =
        await this.machineRepository.countMachineReportForWebapp(machineIds);

      const machineReportMap = new Map<string, CountMachineReport>(
        machineReportCounts.map((machineReportCount) => [
          machineReportCount.machineId,
          {
            reportCount: machineReportCount.reportCount,
            reportOpenCount: machineReportCount.reportOpenCount,
          },
        ]),
      );

      response = machines.map((machine) => ({
        ...machine,
        serviceMeter: formatServiceMeter(machine.serviceMeter),
        pictureUrl: this.storageService.generateSasUrl(
          machine.pictureUrl || machine.machineTypePictureUrl,
        ),
        machineManufacturerName:
          machine.customMachineManufacturerName ||
          machine.machineManufacturerName,
        machineType: machine.customTypeName || machine.machineType,
        serialNumberPlatePictureUrl: this.storageService.generateSasUrl(
          machine.serialNumberPlatePictureUrl,
        ),
        reportCount: machineReportMap.get(machine.machineId)?.reportCount ?? 0,
        reportOpenCount:
          machineReportMap.get(machine.machineId)?.reportOpenCount ?? 0,
        countReport: machineReportMap.get(machine.machineId)?.reportCount ?? 0,
        countReportOpen:
          machineReportMap.get(machine.machineId)?.reportOpenCount ?? 0,
      }));
    }

    return {
      data: plainToInstance(GetMachinesInGroupWebappOutput, response),
      meta: {
        pageInfo: {
          total,
          page,
          limit,
        },
      },
    };
  }

  async getGroupMachineConditionDetail(
    ctx: RequestContext,
    params: GroupParam,
  ): Promise<GetGroupMachineConditionDetailOutput> {
    const machineConditionDetail =
      await this.machineRepository.getGroupMachineConditionDetail(
        params.groupId,
      );

    return plainToInstance(
      GetGroupMachineConditionDetailOutput,
      machineConditionDetail,
    );
  }

  async countGroupInspectionFormStatus(
    ctx: RequestContext,
    params: GroupParam,
  ): Promise<GetGroupInspectionFormDetailOutput> {
    this.logger.log(
      ctx,
      `${this.countGroupInspectionFormStatus.name} was called`,
    );

    const { inspectionFormCount, publishedStatusCount } =
      await this.customInspectionFormRepository.countGroupInspectionFormStatus(
        ctx.user.userId,
        params.groupId,
      );

    return plainToInstance(GetGroupInspectionFormDetailOutput, {
      inspectionFormCount,
      publishedStatusCount,
      draftStatusCount: inspectionFormCount - publishedStatusCount,
    });
  }

  async getGroupDetailInfoForWebapp(
    ctx: RequestContext,
    param: GroupParam,
    groupContext: Group,
  ): Promise<GroupDetailInfoWebappOutput> {
    this.logger.log(ctx, `${this.getGroupDetailInfoForWebapp.name} was called`);
    const { groupId } = param;
    const userId = ctx.user.userId;

    const countFields = [
      GroupSortByField.MACHINE_COUNT,
      GroupSortByField.REPORT_COUNT,
      GroupSortByField.INSPECTION_FORM_COUNT,
      GroupSortByField.MEMBER_COUNT,
    ];

    const [machineCount, reportCount, inspectionFormCount, memberCount] =
      await Promise.all(
        countFields.map((field) =>
          this.repository.getGroupsForWebapp(
            userId,
            0,
            1,
            { field, order: Order.ASC },
            [groupId],
          ),
        ),
      );

    return plainToInstance(GroupDetailInfoWebappOutput, {
      ...groupContext,
      ...machineCount[groupId],
      ...reportCount[groupId],
      ...inspectionFormCount[groupId],
      ...memberCount[groupId],
    });
  }

  async getGroupInspectionForms(
    ctx: RequestContext,
    params: GroupParam,
    queries: GetGroupInspectionFormQuery,
  ): Promise<BaseApiResponse<GetGroupInspectionFormOutput[]>> {
    this.logger.log(ctx, `${this.getGroupInspectionForms.name} was called`);

    const userId = ctx.user.userId;
    const { groupId } = params;
    const { orderBys, limit, page, currentStatus } = queries;
    const offset = limit ? (page - 1) * limit : 0;

    const [total, groupInspectionForms] = await Promise.all([
      this.customInspectionFormRepository.countGroupInspectionForms(
        groupId,
        userId,
        currentStatus,
      ),
      this.customInspectionFormRepository.getGroupInspectionForms(
        groupId,
        userId,
        orderBys,
        limit,
        offset,
        currentStatus,
      ),
    ]);

    return {
      data: groupInspectionForms.map((groupInspectionForm) => ({
        ...groupInspectionForm,
        machinePictureUrl: this.storageService.generateSasUrl(
          groupInspectionForm.machinePictureUrl ||
            groupInspectionForm.machineTypePictureUrl,
        ),
        userPictureUrl: this.storageService.generateSasUrl(
          groupInspectionForm.userPictureUrl,
        ),
      })),
      meta: {
        pageInfo: {
          total,
          page,
          limit,
        },
      },
    };
  }

  async machineFieldsInGroup(
    ctx: RequestContext,
    params: GroupParam,
    queries: GetMachineInGroupWebappQuery,
  ): Promise<BaseApiResponse<GetMachinesInGroupWebappOutput[]>> {
    this.logger.log(ctx, `${this.machineFieldsInGroup.name} was called`);

    const { groupId } = params;
    const { select } = queries;

    const fields = select.map((field) => `machines.${field} "${field}"`);

    fields.push('machines.machineId "machineId"');

    const machines = await this.machineRepository.getMachineFieldsInGroup(
      groupId,
      fields,
    );

    return {
      data: plainToInstance(GetMachinesInGroupWebappOutput, machines),
      meta: {},
    };
  }

  async getAllDataForOffline(
    ctx: RequestContext,
    params: GroupParam,
  ): Promise<GetGroupDataOfflineOutput> {
    this.logger.log(ctx, `${this.getAllDataForOffline.name} was called`);
    const groupId = params.groupId;
    const {
      user: { userId },
      isoLocaleCode,
    } = ctx;
    const user = ctx.user;

    const [
      group,
      machines,
      customInspectionForms,
      customInspectionItems,
      customInspectionItemMedias,
    ] = await Promise.all([
      this.repository.getGroupDetail(userId, groupId),
      this.machineRepository.getMachinesInGroup(groupId, userId, isoLocaleCode),
      this.customInspectionFormRepository.getInspectionFormsInGroup(groupId),
      this.customInspectionItemRepository.getCustomInspectionItemsInGroup(
        groupId,
      ),
      this.customInspectionItemMediaRepository.getCustomInspectionItemMediasInGroup(
        groupId,
      ),
    ]);

    return plainToInstance(GetGroupDataOfflineOutput, {
      ...user,
      pictureUrl: this.storageService.generateSasUrl(user.pictureUrl),
      syncedAt: new Date(),
      group,
      customInspectionForms,
      customInspectionItems,
      machines: machines.map((machine) => ({
        ...machine,
        isFavorite: !!machine.userId,
        pictureUrl: this.storageService.generateSasUrl(
          machine.pictureUrl || machine.machineTypePictureUrl,
        ),
        serialNumberPlatePictureUrl: this.storageService.generateSasUrl(
          machine.serialNumberPlatePictureUrl,
        ),
      })),
      customInspectionItemMedias: customInspectionItemMedias.map((media) => ({
        ...media,
        mediaUrl: this.storageService.generateSasUrl(media.mediaUrl),
      })),
    });
  }
}
