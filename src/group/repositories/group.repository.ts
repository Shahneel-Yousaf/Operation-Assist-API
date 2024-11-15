import { GetGroupsQuery, GetGroupWebappOrderBy } from '@group/dtos';
import { Group } from '@group/entities';
import { Machine } from '@machine/entities';
import { Injectable } from '@nestjs/common';
import {
  CustomInspectionFormCurrentStatus,
  EventType,
  GroupCurrentStatus,
  GroupSortByField,
  MachineCurrentStatus,
  MachineReportCurrentStatus,
  Subtype,
  UserGroupArchiveStatus,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import {
  UserGroupAssignment,
  UserGroupPermissionAssignment,
  UserGroupSetting,
} from '@user/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GroupRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  async findAll(userId: string, permissionId: string, query: GetGroupsQuery) {
    const groups = this.createQueryBuilder('groups')
      .select([
        'groups.groupId groupId',
        'groups.groupName groupName',
        'groups.companyName companyName',
        'groups.currentStatus currentStatus',
        'groups.location location',
        'ugs.isArchived isArchived',
        'groups.lastStatusUpdatedAt lastStatusUpdatedAt',
        'COUNT(DISTINCT uga.userId) userAssignmentCount',
        'COUNT(DISTINCT machine.machineId) machineAssignmentCount',
        `CASE WHEN userGroupPermissionAssignment.permissionId IS NULL THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END AS allowEditDeleteGroup`,
      ])
      .innerJoin(
        UserGroupAssignment,
        'userGroupAssignment',
        `groups.groupId = userGroupAssignment.groupId AND 
        userGroupAssignment.userId = :userId AND 
        userGroupAssignment.currentStatus = :userGroupAssignmentCurrentStatus AND groups.currentStatus != :currentStatus`,
      )
      .leftJoin(
        UserGroupAssignment,
        'uga',
        'uga.groupId = userGroupAssignment.groupId AND uga.currentStatus = :userGroupAssignmentCurrentStatus',
      )
      .leftJoin(
        UserGroupPermissionAssignment,
        'userGroupPermissionAssignment',
        `userGroupPermissionAssignment.userId = :userId AND 
        userGroupPermissionAssignment.groupId = userGroupAssignment.groupId AND 
        userGroupPermissionAssignment.permissionId = :permissionId`,
      )
      .leftJoin(
        Machine,
        'machine',
        'machine.groupId = groups.groupId AND machine.currentStatus != :machineCurrentStatus',
      )
      .leftJoin(
        UserGroupSetting,
        'ugs',
        'ugs.groupId = userGroupAssignment.groupId AND ugs.userId = userGroupAssignment.userId',
      );

    if (query.status) {
      groups.where('ugs.isArchived = :status');
    }

    return groups
      .groupBy(
        'groups.groupId, groups.groupName, groups.currentStatus, groups.location, groups.lastStatusUpdatedAt, ugs.isArchived, userGroupPermissionAssignment.permissionId, groups.companyName',
      )
      .orderBy('groups.groupName')
      .setParameters({
        userId,
        permissionId,
        status: query.status === UserGroupArchiveStatus.ARCHIVED ? 1 : 0,
        currentStatus: GroupCurrentStatus.DELETED,
        userGroupAssignmentCurrentStatus:
          UserGroupAssignmentCurrentStatus.ASSIGNED,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .getRawMany();
  }

  async findGroupById(groupId: string) {
    return this.createQueryBuilder('groups')
      .where('groups.groupId = :groupId')
      .setParameters({
        groupId,
      })
      .getOne();
  }

  async getListGroupByIds(groupIds: string[], userId: string) {
    return this.createQueryBuilder('groups')
      .leftJoinAndSelect(
        'groups.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.userId = :userId AND userGroupAssignments.currentStatus = :currentStatus',
      )
      .where('groups.groupId IN(:...groupIds)')
      .setParameters({
        groupIds,
        userId,
        currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      })
      .getMany();
  }

  async getGroupDetailById(groupId: string, userId: string) {
    return this.createQueryBuilder('groups')
      .select([
        'groups.groupId groupId',
        'groups.groupName groupName',
        'groups.companyName companyName',
        'groups.currentStatus currentStatus',
        'groups.location location',
        'groups.lastStatusUpdatedAt lastStatusUpdatedAt',
        'groups.allowNonKomatsuInfoUse allowNonKomatsuInfoUse',
        'userGroupSettings.isArchived isArchived',
      ])
      .innerJoin(
        'groups.userGroupSettings',
        'userGroupSettings',
        'userGroupSettings.groupId = :groupId AND userGroupSettings.userId = :userId',
      )
      .setParameters({
        groupId,
        userId,
      })
      .getRawOne();
  }

  async getGroupRelationships(
    groupId: string,
    userId?: string,
    machineId?: string,
    inspectionId?: string,
    machineReportId?: string,
    customInspectionFormId?: string,
  ) {
    const group = this.createQueryBuilder('groups').where(
      'groups.groupId = :groupId',
    );

    if (userId) {
      group
        .leftJoinAndSelect(
          'groups.userGroupAssignments',
          'userGroupAssignments',
          'userGroupAssignments.userId = :userId',
        )
        .leftJoinAndSelect('userGroupAssignments.user', 'users');
    }

    if (machineId) {
      group.leftJoinAndSelect(
        'groups.machines',
        'machines',
        'machines.machineId = :machineId',
      );
    }

    if (inspectionId) {
      group.leftJoinAndSelect(
        'machines.inspections',
        'inspections',
        'inspections.inspectionId = :inspectionId',
      );
    }

    if (machineReportId) {
      group.leftJoinAndSelect(
        'machines.machineReports',
        'machineReports',
        'machineReports.machineReportId = :machineReportId',
      );
    }

    if (customInspectionFormId) {
      group.leftJoinAndSelect(
        'machines.customInspectionForms',
        'customInspectionForms',
        'customInspectionForms.customInspectionFormId = :customInspectionFormId',
      );
    }

    return group
      .setParameters({
        groupId,
        userId,
        machineId,
        inspectionId,
        machineReportId,
        customInspectionFormId,
      })
      .getOne();
  }

  async getGroupsForWebapp(
    userId: string,
    offset: number,
    limit: number,
    orderBy: GetGroupWebappOrderBy,
    groupIds: string[] = [],
  ): Promise<Record<string, Group>> {
    const { field, order } = orderBy;

    const groups = this.createQueryBuilder('groups')
      .select(['groups.groupId "groupId"'])
      .innerJoin(
        'groups.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.userId = :userId AND userGroupAssignments.currentStatus = :assignedStatus',
      )
      .where('groups.currentStatus != :deletedStatus');

    switch (field) {
      case GroupSortByField.MACHINE_COUNT:
        groups
          .addSelect(['COUNT(machines.machineId) "machineCount"'])
          .leftJoin(
            'groups.machines',
            'machines',
            'machines.currentStatus != :deletedStatus',
          );

        break;

      case GroupSortByField.REPORT_COUNT:
        groups
          .addSelect([
            'COUNT(machineReportResponse.machineReportResponseId) "reportCount"',
          ])
          .leftJoin(
            'groups.machines',
            'machines',
            'machines.currentStatus != :deletedStatus',
          )
          .leftJoin(
            'machines.machineReports',
            'machineReports',
            'machineReports.currentStatus != :draftStatus',
          )
          .leftJoin(
            'machineReports.firstMachineReportResponse',
            'machineReportResponse',
            '(machineReportResponse.subType = :incidentReports OR machineReportResponse.subType = :maintenanceReports)',
          );

        break;

      case GroupSortByField.INSPECTION_FORM_COUNT:
        groups
          .addSelect([
            'COUNT(customInspectionForm.customInspectionFormId) "inspectionFormCount"',
          ])
          .leftJoin(
            'groups.machines',
            'machines',
            'machines.currentStatus != :deletedStatus',
          )
          .leftJoin(
            'machines.customInspectionFormHistories',
            'customInspectionFormHistories',
            'customInspectionFormHistories.eventType = :createdStatus',
          )
          .leftJoin(
            'customInspectionFormHistories.customInspectionForm',
            'customInspectionForm',
            `customInspectionForm.currentStatus = :publishedStatus 
              OR (
                customInspectionForm.currentStatus = :draftStatus 
                AND customInspectionFormHistories.actionedByUserId = :userId 
              )`,
          );

        break;

      default:
        groups
          .addSelect([
            'groups.groupName "groupName"',
            'groups.companyName "companyName"',
            'groups.location "location"',
            'groups.currentStatus "currentStatus"',
            'COUNT(groupUser.userId) "memberCount"',
          ])
          .leftJoin(
            'groups.userGroupAssignments',
            'groupUser',
            'groupUser.currentStatus = :assignedStatus',
          );
    }

    if (groupIds.length) {
      groups.andWhere('groups.groupId IN (:...groupIds)');
    } else {
      if (limit) {
        groups.limit(limit);
      }

      groups
        .offset(offset)
        .orderBy(field, order)
        .addOrderBy('groups.groupId', order);
    }

    const resp = await groups
      .groupBy(
        'groups.groupId, groups.groupName, groups.location, groups.currentStatus, groups.companyName',
      )
      .setParameters({
        userId,
        groupIds,
        assignedStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
        deletedStatus: MachineCurrentStatus.DELETED,
        draftStatus: MachineReportCurrentStatus.DRAFT,
        createdStatus: EventType.CREATE,
        publishedStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        incidentReports: Subtype.INCIDENT_REPORTS,
        maintenanceReports: Subtype.MAINTENANCE_REPORTS,
      })
      .getRawMany();

    return resp.reduce((acc, curr) => {
      acc[curr.groupId] = curr;
      return acc;
    }, {});
  }

  async countGroupForWebapp(userId: string) {
    return this.createQueryBuilder('group')
      .innerJoin(
        'group.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.userId = :userId AND userGroupAssignments.currentStatus = :assignedStatus',
      )
      .where('group.currentStatus != :deletedStatus')
      .setParameters({
        userId,
        assignedStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
        deletedStatus: MachineCurrentStatus.DELETED,
      })
      .getCount();
  }

  async getGroupDetail(userId: string, groupId: string) {
    const groups = this.createQueryBuilder('groups')
      .select([
        'groups.groupId groupId',
        'groups.groupName groupName',
        'COUNT(DISTINCT uga.userId) userAssignmentCount',
        'COUNT(DISTINCT machine.machineId) machineAssignmentCount',
      ])
      .innerJoin(
        UserGroupAssignment,
        'userGroupAssignment',
        `groups.groupId = userGroupAssignment.groupId AND 
        userGroupAssignment.userId = :userId AND 
        userGroupAssignment.currentStatus = :userGroupAssignmentCurrentStatus AND groups.currentStatus != :currentStatus`,
      )
      .leftJoin(
        UserGroupAssignment,
        'uga',
        'uga.groupId = userGroupAssignment.groupId AND uga.currentStatus = :userGroupAssignmentCurrentStatus',
      )
      .leftJoin(
        Machine,
        'machine',
        'machine.groupId = groups.groupId AND machine.currentStatus != :machineCurrentStatus',
      );

    return groups
      .where('groups.groupId = :groupId')
      .groupBy('groups.groupId, groups.groupName')
      .setParameters({
        userId,
        groupId,
        currentStatus: GroupCurrentStatus.DELETED,
        userGroupAssignmentCurrentStatus:
          UserGroupAssignmentCurrentStatus.ASSIGNED,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .getRawOne();
  }
}
