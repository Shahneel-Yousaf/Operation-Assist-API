import {
  CreateGroupInput,
  DeleteGroupsInput,
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
  GroupAvailableMachineQuery,
  GroupCandidateUserOutput,
  GroupCandidateUserQuery,
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
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  defaultExamples,
  permissions,
  PLATFORM,
  Platform,
  platformOutput,
} from '@shared/constants';
import { GroupContext, Permission } from '@shared/decorators';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { I18nService } from 'nestjs-i18n';

@ApiTags('groups')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('groups')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly logger: AppLogger,
    private readonly i18n: I18nService,
  ) {
    this.logger.setContext(GroupController.name);
  }

  @Get()
  @ApiOperation({ summary: 'List site API' })
  @ApiExtraModels(
    SwaggerBaseApiResponse([GetGroupWebappOutput]),
    SwaggerBaseApiResponse(GetGroupsBaseOutput),
  )
  @ApiOkResponse(
    platformOutput(
      SwaggerBaseApiResponse(GetGroupsBaseOutput),
      SwaggerBaseApiResponse([GetGroupWebappOutput]),
    ),
  )
  @ApiHeader(defaultExamples.platform)
  async findAll(
    @ReqContext() ctx: RequestContext,
    @Query() query: GetGroupsQuery,
    @Headers(PLATFORM) platform?: Platform,
  ): Promise<BaseApiResponse<GetGroupsBaseOutput | GetGroupWebappOutput[]>> {
    this.logger.log(ctx, `${this.findAll.name} was called`);

    if (platform === Platform.WEBAPP) {
      return this.groupService.findGroupsForWebapp(ctx, query);
    }

    const groups = await this.groupService.findAll(ctx, query);

    return { data: groups, meta: {} };
  }

  @Get(':groupId/users')
  @ApiOperation({ summary: 'Get list user in group API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([GetUsersInGroupOutput]) })
  async getGroupUsers(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
  ): Promise<BaseApiResponse<GetUsersInGroupOutput[]>> {
    this.logger.log(ctx, `${this.getGroupUsers.name} was called`);

    const users = await this.groupService.getGroupUsers(ctx, params.groupId);

    return { data: users, meta: {} };
  }

  @Post()
  @ApiOperation({ summary: 'Create group API' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(GroupOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async createGroup(
    @ReqContext() ctx: RequestContext,
    @Body() createGroupInput: CreateGroupInput,
  ): Promise<BaseApiResponse<GroupOutput>> {
    this.logger.log(ctx, `${this.createGroup.name} was called`);

    const group = await this.groupService.createGroup(ctx, createGroupInput);

    return {
      data: group,
      meta: {
        successMessage: this.i18n.t('message.group.createSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Get(':groupId/candidate-users')
  @Permission(permissions.userGroupAssignment.read)
  @ApiOperation({ summary: 'Get candidate user API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([GroupCandidateUserOutput]) })
  async getGroupCandidateUsers(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Query() queries: GroupCandidateUserQuery,
  ): Promise<BaseApiResponse<GroupCandidateUserOutput[]>> {
    this.logger.log(ctx, `${this.getGroupCandidateUsers.name} was called`);

    const candidateUsers = await this.groupService.getGroupCandidateUsers(
      ctx,
      params.groupId,
      queries.search,
    );

    return { data: candidateUsers, meta: {} };
  }

  @Get(':groupId/permissions')
  @ApiOperation({ summary: 'Get user permissions in group API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(PermissionInGroupOutput) })
  async getUserPermissionInGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
  ): Promise<BaseApiResponse<PermissionInGroupOutput>> {
    this.logger.log(ctx, `${this.getUserPermissionInGroup.name} was called`);

    const permission = await this.groupService.getUserPermissionInGroup(
      ctx,
      params,
    );

    return { data: permission, meta: {} };
  }

  @Permission(permissions.userGroupAssignment.create)
  @Post(':groupId/users/invitations')
  @ApiOperation({ summary: 'Invite user into group' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(GroupInvitationOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async inviteUserToGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Body() groupInviteUserInput: GroupInviteUserInput,
  ): Promise<BaseApiResponse<GroupInvitationOutput>> {
    this.logger.log(ctx, `${this.inviteUserToGroup.name} was called`);

    return this.groupService.inviteUserToGroup(
      ctx,
      params,
      groupInviteUserInput,
    );
  }

  @Put('archive-status')
  @ApiOperation({
    summary:
      'Change the status from archive to unarchive and back of users in the group',
  })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateArchiveStatusUserGroup(
    @ReqContext() ctx: RequestContext,
    @Body() groupsUserArchiveStatusInput: GroupsUserArchiveStatusInput,
  ): Promise<BaseApiResponse<object>> {
    this.logger.log(
      ctx,
      `${this.updateArchiveStatusUserGroup.name} was called`,
    );

    return this.groupService.updateArchiveStatusUserGroup(
      ctx,
      groupsUserArchiveStatusInput,
    );
  }

  @Put(':groupId')
  @Permission(permissions.group.update)
  @ApiOperation({ summary: 'Update group' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UpdateGroupOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Body() input: UpdateGroupInput,
    @GroupContext() groupContext: Group,
  ): Promise<BaseApiResponse<UpdateGroupOutput>> {
    this.logger.log(ctx, `${this.updateGroup.name} was called`);

    const group = await this.groupService.updateGroup(
      ctx,
      params.groupId,
      input,
      groupContext,
    );

    return { data: group, meta: {} };
  }

  @Permission(permissions.userGroupAssignment.update)
  @Put(':groupId/users/:userId/user-assignment-info')
  @ApiOperation({ summary: 'Update user assignment info in this group' })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(UserGroupAssignmentOutput),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateUserGroupAssignment(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupUserParam,
    @Body() userGroupAssignmentUpdateInput: UserGroupAssignmentUpdateInput,
  ): Promise<BaseApiResponse<UserGroupAssignmentOutput>> {
    this.logger.log(ctx, `${this.updateUserGroupAssignment.name} was called`);

    const userGroupAssignment =
      await this.groupService.updateUserGroupAssignment(
        ctx,
        params,
        userGroupAssignmentUpdateInput,
      );

    return {
      data: userGroupAssignment,
      meta: {
        successMessage: this.i18n.t('message.group.updateUserSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Permission(permissions.userGroupAssignment.delete)
  @Delete(':groupId/users/:userId/user-assignment-info')
  @ApiOperation({
    summary: 'Remove a user who has been assigned to this group',
  })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  async deleteUserInGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupUserParam,
  ) {
    this.logger.log(ctx, `${this.deleteUserInGroup.name} was called`);

    await this.groupService.deleteUserInGroup(ctx, params);

    return {
      data: {},
      meta: {
        successMessage: this.i18n.t('message.group.deleteUserSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete groups' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async deleteGroups(
    @ReqContext() ctx: RequestContext,
    @Body() deleteGroupsInput: DeleteGroupsInput,
  ) {
    this.logger.log(ctx, `${this.deleteGroups.name} was called`);

    return await this.groupService.deleteGroups(
      ctx,
      deleteGroupsInput.groupIds,
    );
  }

  @Get(':groupId/users/:userId/user-assignment-info')
  @ApiOperation({ summary: 'Get user permission setting in group' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(UserAssignmentInfoOutput),
  })
  async getUserAssignmentInfo(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupUserParam,
  ): Promise<BaseApiResponse<UserAssignmentInfoOutput>> {
    this.logger.log(ctx, `${this.getUserAssignmentInfo.name} was called`);

    const userAssignment = await this.groupService.getUserAssignmentInfo(
      ctx,
      params,
    );

    return { data: userAssignment, meta: {} };
  }

  @Put(':groupId/machines/:machineId/favorites')
  @ApiOperation({ summary: 'Update favorite or un-favorite for machines' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(MachineFavoriteOutput),
  })
  async updateMachineFavoriteStatus(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
  ): Promise<BaseApiResponse<MachineFavoriteOutput>> {
    this.logger.log(ctx, `${this.updateMachineFavoriteStatus.name} was called`);

    const result = await this.groupService.updateMachineFavoriteStatus(
      ctx,
      params,
    );

    return { data: result, meta: {} };
  }

  @Get(':groupId')
  @ApiExtraModels(
    SwaggerBaseApiResponse(GroupDetailInfoOutput),
    SwaggerBaseApiResponse(GroupDetailInfoWebappOutput),
  )
  @ApiOkResponse(
    platformOutput(
      SwaggerBaseApiResponse(GroupDetailInfoOutput),
      SwaggerBaseApiResponse(GroupDetailInfoWebappOutput),
    ),
  )
  @ApiHeader(defaultExamples.platform)
  @ApiOperation({ summary: 'Get group detail info' })
  async getGroupDetailInfo(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @GroupContext() groupContext?: Group,
    @Headers(PLATFORM) platform?: Platform,
  ): Promise<
    BaseApiResponse<GroupDetailInfoOutput | GroupDetailInfoWebappOutput>
  > {
    this.logger.log(ctx, `${this.getGroupDetailInfo.name} was called`);

    let groupDetailInfo;

    if (platform === Platform.WEBAPP) {
      groupDetailInfo = await this.groupService.getGroupDetailInfoForWebapp(
        ctx,
        params,
        groupContext,
      );
    } else {
      groupDetailInfo = await this.groupService.getGroupDetailInfo(ctx, params);
    }

    return { data: groupDetailInfo, meta: {} };
  }

  @Permission(permissions.machine.create)
  @Post(':groupId/machines/group-machine-assignments')
  @ApiOperation({ summary: 'Assign machine into group API' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async assignMachineIntoGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Body() body: MachinesAssignIntoGroupInput,
  ): Promise<BaseApiResponse<object>> {
    this.logger.log(ctx, `${this.assignMachineIntoGroup.name} was called`);

    return this.groupService.assignMachineIntoGroup(ctx, params, body);
  }

  @Get(':groupId/available-machines')
  @Permission(permissions.machine.read)
  @ApiOperation({
    summary: 'Get list suggestion & search machine for assignment',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([GroupAvailableMachineOutput]),
  })
  async getGroupAvailableMachines(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Query() queries: GroupAvailableMachineQuery,
  ): Promise<BaseApiResponse<GroupAvailableMachineOutput[]>> {
    this.logger.log(ctx, `${this.getGroupAvailableMachines.name} was called`);

    const machines = await this.groupService.getGroupAvailableMachines(
      ctx,
      params.groupId,
      queries.search,
    );

    return { data: machines, meta: {} };
  }

  @Post(':groupId/machines')
  @Permission(permissions.machine.create)
  @ApiOperation({ summary: 'Create new machine in a group' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(MachineOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createMachineInGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Body() machineInput: MachineInput,
  ): Promise<BaseApiResponse<MachineOutput>> {
    this.logger.log(ctx, `${this.createMachineInGroup.name} was called`);

    const machine = await this.groupService.createMachineInGroup(
      ctx,
      params,
      machineInput,
    );

    return {
      data: machine,
      meta: {
        successMessage: this.i18n.t('message.group.addMachineSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Get(':groupId/machines')
  @ApiExtraModels(
    SwaggerBaseApiResponse([GetMachinesInGroupWebappOutput]),
    SwaggerBaseApiResponse(GetMachinesInGroupOutput),
  )
  @ApiOkResponse(
    platformOutput(
      SwaggerBaseApiResponse(GetMachinesInGroupOutput),
      SwaggerBaseApiResponse([GetMachinesInGroupWebappOutput]),
    ),
  )
  @ApiHeader(defaultExamples.platform)
  @ApiOperation({ summary: 'Get list machine in group' })
  async getMachinesInGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Query() queries: GetMachineInGroupWebappQuery,
    @Headers(PLATFORM) platform?: Platform,
  ): Promise<
    BaseApiResponse<GetMachinesInGroupOutput | GetMachinesInGroupWebappOutput[]>
  > {
    this.logger.log(ctx, `${this.getMachinesInGroup.name} was called`);

    if (queries.select?.length) {
      return this.groupService.machineFieldsInGroup(ctx, params, queries);
    }

    if (platform === Platform.WEBAPP) {
      return this.groupService.getMachinesInGroupForWebapp(
        ctx,
        params,
        queries,
      );
    }

    const machines = await this.groupService.getMachinesInGroup(ctx, params);

    return { data: machines, meta: {} };
  }

  @Get(':groupId/machines/:machineId')
  @ApiOperation({ summary: 'Get machine detail info' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(MachineDetailInfoOutput),
  })
  async getMachineDetailInfo(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
  ): Promise<BaseApiResponse<MachineDetailInfoOutput>> {
    this.logger.log(ctx, `${this.getMachineDetailInfo.name} was called`);

    const machineDetailInfo = await this.groupService.getMachineDetailInfo(
      ctx,
      params,
    );

    return { data: machineDetailInfo, meta: {} };
  }

  @Permission(permissions.machine.update)
  @Put(':groupId/machines/:machineId')
  @ApiOperation({
    summary: 'Update machine in a group',
  })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UpdateMachineInGroupOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateMachineInGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: UpdateMachineInGroupInput,
  ): Promise<BaseApiResponse<UpdateMachineInGroupOutput>> {
    this.logger.log(ctx, `${this.updateMachineInGroup.name} was called`);

    const machine = await this.groupService.updateMachineInGroup(
      ctx,
      params,
      input,
    );

    return {
      meta: {
        successMessage: this.i18n.t('message.group.editMachineSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
      data: machine,
    };
  }

  @Delete(':groupId/machines/:machineId')
  @Permission(permissions.machine.delete)
  @ApiOperation({ summary: 'Delete machine in group' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async deleteMachineInGroup(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
  ) {
    this.logger.log(ctx, `${this.deleteMachineInGroup.name} was called`);

    return this.groupService.deleteMachineInGroup(ctx, params);
  }

  @Permission(permissions.inspection.create)
  @Put(':groupId/machines/:machineId/machine-conditions')
  @ApiOperation({ summary: 'Update machine condition status' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UpdateMachineConditionOutput) })
  async updateMachineConditionStatus(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: UpdateMachineConditionInput,
  ): Promise<BaseApiResponse<UpdateMachineConditionOutput>> {
    this.logger.log(
      ctx,
      `${this.updateMachineConditionStatus.name} was called`,
    );

    const machineCondition =
      await this.groupService.updateMachineConditionStatus(ctx, params, input);

    return { data: machineCondition, meta: {} };
  }

  @Get(':groupId/conditions')
  @ApiOperation({ summary: 'Count the number of machines in each condition' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetGroupMachineConditionDetailOutput),
  })
  async getGroupMachineConditionDetail(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
  ): Promise<BaseApiResponse<GetGroupMachineConditionDetailOutput>> {
    this.logger.log(
      ctx,
      `${this.getGroupMachineConditionDetail.name} was called`,
    );

    const groupMachineConditionDetail =
      await this.groupService.getGroupMachineConditionDetail(ctx, params);

    return {
      data: groupMachineConditionDetail,
      meta: {},
    };
  }

  @Get(':groupId/inspection-form-status')
  @ApiOperation({
    summary: 'Count the number of the machine inspection form status',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetGroupInspectionFormDetailOutput),
  })
  async countGroupInspectionFormStatus(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
  ): Promise<BaseApiResponse<GetGroupInspectionFormDetailOutput>> {
    this.logger.log(
      ctx,
      `${this.countGroupInspectionFormStatus.name} was called`,
    );

    const countMachineInspectionFormStatus =
      await this.groupService.countGroupInspectionFormStatus(ctx, params);

    return {
      data: countMachineInspectionFormStatus,
      meta: {},
    };
  }

  @Get(':groupId/inspection-forms')
  @ApiOperation({ summary: 'Group inspection forms' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetGroupInspectionFormOutput),
  })
  async getGroupInspectionForms(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
    @Query() queries: GetGroupInspectionFormQuery,
  ): Promise<BaseApiResponse<GetGroupInspectionFormOutput[]>> {
    this.logger.log(ctx, `${this.getGroupInspectionForms.name} was called`);

    return this.groupService.getGroupInspectionForms(ctx, params, queries);
  }

  @Get(':groupId/offline-sync-data')
  @ApiOperation({ summary: 'Get data for all offline support table' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetGroupDataOfflineOutput),
  })
  async getAllDataForOffline(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupParam,
  ): Promise<BaseApiResponse<GetGroupDataOfflineOutput>> {
    this.logger.log(ctx, `${this.getAllDataForOffline.name} was called`);
    const data = await this.groupService.getAllDataForOffline(ctx, params);
    return { data, meta: {} };
  }
}
