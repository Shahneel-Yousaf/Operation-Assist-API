import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const reportActionChoiceTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    report_action_choice_id: string;
    report_action_choice_code: string;
  }[] = [
    {
      report_action_choice_id: '0667RPVE4N1END6NE1V9QCHW8W',
      report_action_choice_code: 'SELF_REPAIR',
    },
    {
      report_action_choice_id: '0667RPVE4Q3VTC6BJ03Z0HXJG4',
      report_action_choice_code: 'REPAIR_REQUEST',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'report_action_choices',
    ['report_action_choice_id'],
    data,
  );
};
