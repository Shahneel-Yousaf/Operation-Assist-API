import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const maintenanceReasonPeriodChoiceTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    maintenance_reason_period_choice_id: string;
    maintenance_reason_period_choice_code: string;
    position: number;
  }[] = [
    {
      maintenance_reason_period_choice_id: '01J1VX7T8P1MKJA2HDTMXZ778M',
      maintenance_reason_period_choice_code: 'PERIOD_1M',
      position: 1,
    },
    {
      maintenance_reason_period_choice_id: '01J1VX80SFP41TWFG40H61Q97T',
      maintenance_reason_period_choice_code: 'PERIOD_6M',
      position: 2,
    },
    {
      maintenance_reason_period_choice_id: '01J1ZCE3MKAZJ8R65AWAGG8HQY',
      maintenance_reason_period_choice_code: 'PERIOD_12M',
      position: 3,
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'maintenance_reason_period_choices',
    ['maintenance_reason_period_choice_id'],
    data,
  );
};
