import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const userGroupRoleTemplatePermissionAssignmentTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    permission_id: string;
    user_group_role_template_id: string;
    assigned_at: string;
  }[] = [
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      assigned_at: '2023-12-18',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      assigned_at: '2023-10-01',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      assigned_at: '2023-10-01',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'user_group_role_template_permission_assignments',
    ['permission_id', 'user_group_role_template_id'],
    data,
  );
};
