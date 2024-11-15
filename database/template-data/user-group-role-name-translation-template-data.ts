import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const userGroupRoleNameTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    user_group_role_template_id: string;
    iso_locale_code: string;
    role_name: string;
  }[] = [
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'en-US',
      role_name: 'Site manager',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'en-US',
      role_name: 'Operator',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'en-US',
      role_name: 'Machine manager',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'en-US',
      role_name: 'Mechanic',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'en-US',
      role_name: 'Others',
    },
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'ja',
      role_name: '現場管理者',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'ja',
      role_name: 'オペレーター',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'ja',
      role_name: '機械管理者',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'ja',
      role_name: '整備士',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'ja',
      role_name: 'その他',
    },
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'es-CL',
      role_name: 'Administrador del sitio',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'es-CL',
      role_name: 'Operador',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'es-CL',
      role_name: 'Administrador de máquina',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'es-CL',
      role_name: 'Mecánico',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'es-CL',
      role_name: 'Otros',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'user_group_role_name_translations',
    ['user_group_role_template_id', 'iso_locale_code'],
    data,
  );
};
