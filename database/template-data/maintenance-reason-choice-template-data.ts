import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const maintenanceReasonChoiceTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    maintenance_reason_choice_id: string;
    maintenance_reason_choice_code: string;
    position: number;
  }[] = [
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      maintenance_reason_choice_code: 'SMR_ELAPSE',
      position: 1,
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      maintenance_reason_choice_code: 'PERIOD_ELAPSE',
      position: 2,
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      maintenance_reason_choice_code: 'IRREGULAR',
      position: 3,
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'maintenance_reason_choices',
    ['maintenance_reason_choice_id'],
    data,
  );
};
