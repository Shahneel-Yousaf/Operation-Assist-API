import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const reportActionChoiceTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    report_action_choice_id: string;
    iso_locale_code: string;
    report_action_choice_name: string;
  }[] = [
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      iso_locale_code: 'en-US',
      report_action_choice_name: 'Self repair',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      iso_locale_code: 'en-US',
      report_action_choice_name: 'Repair request (agency/manufacturer)',
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
  ];

  await insertOrUpsertTable(
    queryRunner,
    'report_action_choice_translations',
    ['report_action_choice_id', 'iso_locale_code'],
    data,
  );
};
