import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const irregularMaintenanceItemChoiceTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    irregular_maintenance_item_choice_id: string;
    irregular_maintenance_item_choice_code: string;
    position: number;
    is_disabled: number;
  }[] = [
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      irregular_maintenance_item_choice_code: 'CLEAN_AIRCLEANER',
      position: 1,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      irregular_maintenance_item_choice_code: 'EXCHANGE_AIRCLEANER',
      position: 2,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      irregular_maintenance_item_choice_code: 'REFILL_COOLANT',
      position: 3,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      irregular_maintenance_item_choice_code: 'EXCHANGE_COOLANT',
      position: 4,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      irregular_maintenance_item_choice_code: 'INSPECT_BATTERY',
      position: 5,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      irregular_maintenance_item_choice_code: 'OIL_CLINIC',
      position: 6,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      irregular_maintenance_item_choice_code: 'RUST_PROOF',
      position: 7,
      is_disabled: 0,
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      irregular_maintenance_item_choice_code: 'OTHERS',
      position: 8,
      is_disabled: 0,
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'irregular_maintenance_item_choices',
    ['irregular_maintenance_item_choice_id'],
    data,
  );
};
