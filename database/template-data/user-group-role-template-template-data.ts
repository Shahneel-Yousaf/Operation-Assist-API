import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const userGroupRoleTemplateTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    user_group_role_template_id: string;
    role_code: string;
    is_admin: number;
  }[] = [
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      role_code: 'role code 1',
      is_admin: 1,
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      role_code: 'role code 2',
      is_admin: 0,
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      role_code: 'role code 3',
      is_admin: 0,
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      role_code: 'role code 4',
      is_admin: 0,
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      role_code: 'role code 5',
      is_admin: 0,
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'user_group_role_templates',
    ['user_group_role_template_id'],
    data,
  );
};
