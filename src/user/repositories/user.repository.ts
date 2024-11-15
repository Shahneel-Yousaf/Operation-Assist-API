import { GroupCandidateUserOutput } from '@group/dtos';
import { Injectable } from '@nestjs/common';
import {
  DeviceCurrentStatus,
  EMAIL_REGEX,
  UserCurrentStatus,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { User } from '@user/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getGroupUsers(groupId: string, isoLocaleCode: string) {
    return this.createQueryBuilder('user')
      .innerJoinAndSelect('user.userGroupAssignments', 'userGroupAssignments')
      .innerJoinAndSelect(
        'userGroupAssignments.userGroupRoleNameTranslation',
        'userGroupRoleNameTranslation',
        'userGroupRoleNameTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .where('user.currentStatus != :userCurrentStatus')
      .andWhere('userGroupAssignments.groupId = :groupId')
      .andWhere(
        `userGroupAssignments.currentStatus = :userGroupAssignmentCurrentStatus`,
      )
      .orderBy('user.surname')
      .setParameters({
        userCurrentStatus: UserCurrentStatus.DELETED,
        userGroupAssignmentCurrentStatus:
          UserGroupAssignmentCurrentStatus.ASSIGNED,
        groupId,
        isoLocaleCode,
      })
      .getMany();
  }

  async getUserInvitee(userId: string, groupId: string): Promise<User> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.groupId = :groupId',
      )
      .leftJoinAndSelect(
        'user.groupInvitees',
        'groupInvitees',
        'groupInvitees.groupId = :groupId AND groupInvitees.invitationResponse IS NULL',
      )
      .where('user.userId = :userId')
      .setParameters({
        userId,
        groupId,
      })
      .getOne();
  }

  async userCandidateSuggestions(groupId: string, userId: string) {
    return this.createQueryBuilder('users')
      .select([
        'users.userId',
        'users.givenName',
        'users.surname',
        'users.email',
        'users.pictureUrl',
        'users.searchId',
      ])
      .innerJoin(
        'users.groupInvitees',
        'groupInvitees',
        'groupInvitees.inviterUserId = :userId',
      )
      .leftJoin(
        'users.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.groupId = :groupId AND userGroupAssignments.currentStatus = :userGroupAssignmentCurrentStatus',
      )
      .where('userGroupAssignments.userId IS NULL')
      .andWhere('users.currentStatus != :userCurrentStatus')
      .orderBy('users.surname, users.givenName')
      .setParameters({
        groupId,
        userId,
        userGroupAssignmentCurrentStatus:
          UserGroupAssignmentCurrentStatus.ASSIGNED,
        userCurrentStatus: UserCurrentStatus.DELETED,
      })
      .distinct(true)
      .getMany();
  }

  async getGroupCandidateUserBySearch(
    groupId: string,
    search: string,
  ): Promise<GroupCandidateUserOutput[]> {
    const response = this.createQueryBuilder('users')
      .select([
        'users.userId "userId"',
        'users.givenName "givenName"',
        'users.surname "surname"',
        'users.email "email"',
        'users.pictureUrl "pictureUrl"',
        'users.searchId "searchId"',
        'CASE WHEN userGroupAssignments.userId IS NULL THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END "isAlreadyInGroup"',
      ])
      .leftJoin(
        'users.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.groupId = :groupId AND userGroupAssignments.currentStatus = :userGroupAssignmentCurrentStatus',
      )
      .andWhere('users.currentStatus != :userCurrentStatus');

    if (EMAIL_REGEX.test(search)) {
      response
        .andWhere('users.email = :search')
        .andWhere('users.isSearchableByEmail = 1');
    } else {
      response.andWhere('users.searchId = :search');
    }

    return response
      .setParameters({
        groupId,
        search,
        userGroupAssignmentCurrentStatus:
          UserGroupAssignmentCurrentStatus.ASSIGNED,
        userCurrentStatus: UserCurrentStatus.DELETED,
      })
      .getRawMany();
  }

  /**
   * Get user profiles where the oid and iss match in the userCiamLinks table.
   */
  async getUserByCiam(oid: string, iss: string): Promise<User> {
    return this.createQueryBuilder('users')
      .innerJoinAndSelect('users.userCiamLinks', 'userCiamLinks')
      .where('userCiamLinks.oid = :oid AND userCiamLinks.iss = :iss')
      .setParameters({ oid, iss })
      .getOne();
  }

  async getUserGroupAssignment(userId: string, groupId: string) {
    return this.createQueryBuilder('users')
      .leftJoinAndSelect(
        'users.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.groupId = :groupId',
      )
      .where('users.userId = :userId')
      .setParameters({
        userId,
        groupId,
      })
      .getOne();
  }

  async getUserDevicesInGroup(
    groupId: string,
    userId: string,
    isInspectionNotification: boolean = false,
    isReportNotification: boolean = false,
  ) {
    const response = this.createQueryBuilder('users')
      .innerJoin(
        'users.userGroupAssignments',
        'userGroupAssignments',
        'userGroupAssignments.groupId = :groupId AND userGroupAssignments.currentStatus = :userGroupAssignmentCurrentStatus',
      )
      .innerJoinAndSelect(
        'users.devices',
        'devices',
        'devices.currentStatus != :deviceCurrentStatus',
      )
      .innerJoin('users.userSetting', 'userSetting')
      .innerJoin(
        'users.userGroupSettings',
        'userGroupSettings',
        'userGroupSettings.groupId = :groupId AND userGroupSettings.isArchived = 0',
      )
      .where('users.currentStatus != :currentStatus')
      .andWhere('users.userId != :userId');
    if (isInspectionNotification) {
      response.andWhere('userSetting.inspectionNotification = 1');
    }

    if (isReportNotification) {
      response.andWhere('userSetting.reportNotification = 1');
    }

    return response
      .setParameters({
        groupId,
        userGroupAssignmentCurrentStatus:
          UserGroupAssignmentCurrentStatus.ASSIGNED,
        deviceCurrentStatus: DeviceCurrentStatus.DELETED,
        currentStatus: UserCurrentStatus.DELETED,
        userId,
      })
      .getMany();
  }

  /**
   * Get user profiles and user settings where oid and iss match in the userCiamLinks table.
   */
  async getUserProfile(oid: string, iss: string): Promise<User> {
    return this.createQueryBuilder('users')
      .innerJoinAndSelect('users.userCiamLinks', 'userCiamLinks')
      .innerJoinAndSelect('users.userSetting', 'userSetting')
      .where('userCiamLinks.oid = :oid AND userCiamLinks.iss = :iss')
      .setParameters({ oid, iss })
      .getOne();
  }
}
