import { Group } from '@group/entities';
import {
  User,
  UserCiamLink,
  UserGroupAssignment,
  UserGroupPermissionAssignment,
} from '@user/entities';
import { DataSource, EntityTarget, InsertResult } from 'typeorm';

import {
  mockGroup,
  mockLoginUser,
  mockLoginUserCaimLink,
  mockUserGroupAssignment,
  mockUserGroupPermissionAssignment,
} from './mock/data.mock';

export const clearDatabase = async (
  connection: DataSource,
  tableNames: string[],
) => {
  for (const tableName of tableNames) {
    await connection.query(`DELETE FROM ${tableName};`);
  }
};

export interface TableRecord {
  entity: EntityTarget<any>;
  data: object;
}

export const createRecord = async (
  connection: DataSource,
  tableRecords: TableRecord[],
): Promise<InsertResult[]> => {
  const insertResults: InsertResult[] = [];

  for (const tableRecord of tableRecords) {
    const { entity, data } = tableRecord;
    const insertResult: InsertResult = await connection
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(data)
      .execute();

    insertResults.push(insertResult);
  }

  return insertResults;
};

export const createMockUser = async (
  connection: DataSource,
  mockUser = mockLoginUser,
  mockUserCaimLink = mockLoginUserCaimLink,
) => {
  await createRecord(connection, [
    {
      entity: User,
      data: mockUser,
    },
    { entity: UserCiamLink, data: mockUserCaimLink },
  ]);
};

export const createMockGroup = async (
  connection: DataSource,
  group = mockGroup,
  userGroupAssignment = mockUserGroupAssignment,
  userGroupPermissionAssignment = mockUserGroupPermissionAssignment,
) => {
  await createRecord(connection, [
    {
      entity: Group,
      data: group,
    },
    {
      entity: UserGroupAssignment,
      data: userGroupAssignment,
    },
    {
      entity: UserGroupPermissionAssignment,
      data: userGroupPermissionAssignment,
    },
  ]);
};
