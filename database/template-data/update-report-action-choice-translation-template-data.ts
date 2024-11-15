import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const updateReportActionChoiceTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    report_action_choice_id: string;
    iso_locale_code: string;
    report_action_choice_name: string;
  }[] = [
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'en',
      report_action_choice_name: 'Self repair',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'en',
      report_action_choice_name: 'Repair request (Distributor/Manufacturer)',
    },
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'ja',
      report_action_choice_name: 'セルフ対応',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'ja',
      report_action_choice_name: '修理依頼（代理店・メーカー）',
    },
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'es',
      report_action_choice_name: 'Reparación/mantenimiento propio',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'es',
      report_action_choice_name:
        'Solicitud de reparación (Distribuidor/Fabricante)',
    },
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'pt',
      report_action_choice_name: 'Reparo próprio',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'pt',
      report_action_choice_name:
        'Solicitação de reparo (distribuidor/fabricante)',
    },
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'ur',
      report_action_choice_name: 'خود مرمت',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'ur',
      report_action_choice_name: 'مرمت کی درخواست (ڈسٹریبیوٹر/مینوفیکچرر)',
    },
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'ar',
      report_action_choice_name: 'إصلاح ذاتي',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'ar',
      report_action_choice_name: 'طلب إصلاح (الموزع / الصانع)',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'report_action_choice_translations',
    ['report_action_choice_id', 'iso_locale_code'],
    data,
  );
};
