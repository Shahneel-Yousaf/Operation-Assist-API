import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const updateUserGroupRoleNameTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    user_group_role_template_id: string;
    iso_locale_code: string;
    role_name: string;
  }[] = [
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'en',
      role_name: 'Group manager',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'en',
      role_name: 'Operator',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'en',
      role_name: 'Equipment supervisor',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'en',
      role_name: 'Mechanic',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'en',
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
      iso_locale_code: 'es',
      role_name: 'Gerente/Administrador del sitio de trabajo',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'es',
      role_name: 'Operador',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'es',
      role_name: 'Supervisor de máquinas',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'es',
      role_name: 'Mecánico',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'es',
      role_name: 'Otros',
    },
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'pt',
      role_name: 'Gerente',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'pt',
      role_name: 'Operator',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'pt',
      role_name: 'Supervisor de equipamentos',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'pt',
      role_name: 'Mecânico',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'pt',
      role_name: 'Outros',
    },
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'ur',
      role_name: 'منیجر',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'ur',
      role_name: 'آپریٹر',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'ur',
      role_name: 'سازوسامان کے نگراں',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'ur',
      role_name: 'مکینک',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'ur',
      role_name: 'دیگر',
    },
    {
      user_group_role_template_id: '065BDMT6RRTEF1A989H6AVJT5W',
      iso_locale_code: 'ar',
      role_name: 'مدير',
    },
    {
      user_group_role_template_id: '065BDMV15GYND8AQ8EJSG7JYAC',
      iso_locale_code: 'ar',
      role_name: 'مشغل',
    },
    {
      user_group_role_template_id: '065BDMVRSBPXJ3DQNGP9VMQ2D4',
      iso_locale_code: 'ar',
      role_name: 'مشرف المعدات',
    },
    {
      user_group_role_template_id: '065BDMWJY5NQ8QYFX342C5CDTR',
      iso_locale_code: 'ar',
      role_name: 'ميكانيكي',
    },
    {
      user_group_role_template_id: '065D0EV3Q686CMBSQCDKR1FACC',
      iso_locale_code: 'ar',
      role_name: 'آخرون',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'user_group_role_name_translations',
    ['user_group_role_template_id', 'iso_locale_code'],
    data,
  );
};
