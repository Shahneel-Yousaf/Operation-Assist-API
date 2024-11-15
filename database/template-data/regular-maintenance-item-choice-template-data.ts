import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const regularMaintenanceItemChoiceTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    regular_maintenance_item_choice_id: string;
    regular_maintenance_item_choice_code: string;
    position: number;
    is_disabled: number;
  }[] = [
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      regular_maintenance_item_choice_code: '100HOURS',
      position: 1,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      regular_maintenance_item_choice_code: '100_500HOURS',
      position: 2,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      regular_maintenance_item_choice_code: '100_500_2000HOURS',
      position: 3,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      regular_maintenance_item_choice_code: '500HOURS',
      position: 4,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      regular_maintenance_item_choice_code: '500_1000HOURS',
      position: 5,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      regular_maintenance_item_choice_code: '500_1000_2000HOURS',
      position: 6,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      regular_maintenance_item_choice_code: '500_4500HOURS',
      position: 7,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      regular_maintenance_item_choice_code: '500_1000_4500HOURS',
      position: 8,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      regular_maintenance_item_choice_code: 'WHENREQUIRED_ONLY',
      position: 9,
      is_disabled: 0,
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      regular_maintenance_item_choice_code: 'LONG_TERM',
      position: 10,
      is_disabled: 0,
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'regular_maintenance_item_choices',
    ['regular_maintenance_item_choice_id'],
    data,
  );
};
