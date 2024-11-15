import { Injectable } from '@nestjs/common';
import {
  Operation,
  Resource,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { UserGroupAssignment } from '@user/entities';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UserGroupAssignmentRepository extends Repository<UserGroupAssignment> {
  constructor(private dataSource: DataSource) {
    super(UserGroupAssignment, dataSource.createEntityManager());
  }

  async getUserGroupAssignmentPermissions(
    userId: string,
    groupId: string,
  ): Promise<UserGroupAssignment> {
    return this.findOne({
      where: {
        userId,
        groupId,
        currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      },
      relations: [
        'userGroupPermissionAssignments',
        'userGroupPermissionAssignments.permission',
        'userGroupPermissionAssignments.permission.operation',
        'userGroupPermissionAssignments.permission.resource',
      ],
    });
  }

  async getUserPermissions(
    userId: string,
    groupId: string,
  ): Promise<UserGroupAssignment[]> {
    const whereOption: FindOptionsWhere<UserGroupAssignment> = {
      userId,
      currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
    };
    if (groupId) {
      whereOption.groupId = groupId;
    }

    return this.find({
      where: whereOption,
      relations: [
        'userGroupPermissionAssignments',
        'userGroupPermissionAssignments.permission',
        'userGroupPermissionAssignments.permission.operation',
        'userGroupPermissionAssignments.permission.resource',
      ],
    });
  }

  async checkPermissionInGroup(
    userId: string,
    groupId: string,
  ): Promise<UserGroupAssignment> {
    return this.createQueryBuilder('userGroupAssignment')
      .leftJoinAndSelect(
        'userGroupAssignment.userGroupPermissionAssignments',
        'userGroupPermissionAssignments',
      )
      .leftJoinAndSelect(
        'userGroupPermissionAssignments.permission',
        'permission',
      )
      .leftJoinAndSelect('permission.operation', 'operation')
      .leftJoinAndSelect('permission.resource', 'resource')
      .where('userGroupAssignment.groupId = :groupId')
      .andWhere('userGroupAssignment.currentStatus != :currentStatus')
      .andWhere('userGroupAssignment.userId = :userId')
      .setParameters({
        userId,
        groupId,
        currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
      })
      .getOne();
  }

  async getUserPermissionInGroups(groupIds: string[], userId: string) {
    return this.createQueryBuilder('userGroupAssignment')
      .select(['userGroupPermissionAssignments.groupId'])
      .innerJoin(
        'userGroupAssignment.userGroupPermissionAssignments',
        'userGroupPermissionAssignments',
      )
      .innerJoin('userGroupPermissionAssignments.permission', 'permission')
      .innerJoin('permission.operation', 'operation')
      .innerJoin('permission.resource', 'resource')
      .where('userGroupAssignment.userId = :userId')
      .andWhere('userGroupAssignment.groupId IN(:...groupIds)')
      .andWhere('userGroupAssignment.currentStatus = :currentStatus')
      .andWhere('resource.resource_code = :resourceCode')
      .andWhere('operation.operation_code = :operationCode')
      .groupBy('userGroupPermissionAssignments.groupId')
      .setParameters({
        groupIds,
        userId,
        resourceCode: Resource.GROUPS,
        operationCode: Operation.UPDATE_DELETE,
        currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
      })
      .getRawMany();
  }

  async checkPermissionGroups(userId: string, groupIds: string[]) {
    return this.createQueryBuilder('userGroupAssignment')
      .select([
        'userGroupAssignment.groupId "groupId"',
        'operation.operationCode "operationCode"',
        'resource.resourceCode "resourceCode"',
      ])
      .innerJoin(
        'userGroupAssignment.userGroupPermissionAssignments',
        'userGroupPermissionAssignments',
      )
      .innerJoin('userGroupPermissionAssignments.permission', 'permission')
      .innerJoin('permission.operation', 'operation')
      .innerJoin('permission.resource', 'resource')
      .where('userGroupAssignment.groupId IN (:...groupIds)')
      .andWhere('userGroupAssignment.userId = :userId')
      .andWhere('userGroupAssignment.currentStatus != :currentStatus')
      .setParameters({
        userId,
        groupIds,
        currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
      })
      .getRawMany();
  }

  async checkPermissionInGroupSyncData(
    userId: string,
    groupId: string,
    resourceCode: Resource,
    operationCode: Operation,
  ): Promise<UserGroupAssignment> {
    return this.createQueryBuilder('userGroupAssignment')
      .innerJoinAndSelect(
        'userGroupAssignment.userGroupPermissionAssignments',
        'userGroupPermissionAssignments',
      )
      .innerJoinAndSelect(
        'userGroupPermissionAssignments.permission',
        'permission',
      )
      .innerJoinAndSelect('permission.operation', 'operation')
      .innerJoinAndSelect('permission.resource', 'resource')
      .where('userGroupAssignment.groupId = :groupId')
      .andWhere('userGroupAssignment.userId = :userId')
      .andWhere('operation.operationCode = :operationCode')
      .andWhere('resource.resourceCode = :resourceCode')
      .setParameters({
        userId,
        groupId,
        resourceCode,
        operationCode,
      })
      .getOne();
  }
}
