import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const maintenanceReasonPeriodChoiceTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    maintenance_reason_period_choice_id: string;
    iso_locale_code: string;
    maintenance_reason_period_choice_name: string;
  }[] = [
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      iso_locale_code: 'en',
      maintenance_reason_period_choice_name: '1 month',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      iso_locale_code: 'en',
      maintenance_reason_period_choice_name: '6 months',
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      iso_locale_code: 'en',
      maintenance_reason_period_choice_name: '12 months',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      iso_locale_code: 'ja',
      maintenance_reason_period_choice_name: '1ヵ月',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      iso_locale_code: 'ja',
      maintenance_reason_period_choice_name: '6ヵ月',
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      iso_locale_code: 'ja',
      maintenance_reason_period_choice_name: '12ヵ月',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      iso_locale_code: 'es',
      maintenance_reason_period_choice_name: '1 mes',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      iso_locale_code: 'es',
      maintenance_reason_period_choice_name: '6 meses',
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      iso_locale_code: 'es',
      maintenance_reason_period_choice_name: '12 meses',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      iso_locale_code: 'pt',
      maintenance_reason_period_choice_name: '1 mês',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      iso_locale_code: 'pt',
      maintenance_reason_period_choice_name: '6 meses',
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      iso_locale_code: 'pt',
      maintenance_reason_period_choice_name: '12 meses',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      iso_locale_code: 'ur',
      maintenance_reason_period_choice_name: '1ماہ',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      iso_locale_code: 'ur',
      maintenance_reason_period_choice_name: '6ماہ',
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      iso_locale_code: 'ur',
      maintenance_reason_period_choice_name: '12ماہ',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      iso_locale_code: 'ar',
      maintenance_reason_period_choice_name: '1 شهر',
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      iso_locale_code: 'ar',
      maintenance_reason_period_choice_name: '6 شهور',
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      iso_locale_code: 'ar',
      maintenance_reason_period_choice_name: '12 شهر',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'maintenance_reason_period_choice_translations',
    ['maintenance_reason_period_choice_id'],
    data,
  );
};
