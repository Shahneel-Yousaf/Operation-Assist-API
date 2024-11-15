import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const partTypeTemplateData = async (queryRunner: QueryRunner) => {
  const data: {
    part_type_id: string;
    part_type_code: string;
  }[] = [
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_code: 'FILTERS_ENGINE',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_code: 'FILTERS_ENGINE',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_code: 'WORKING_MACHINE',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_code: 'SUSPENSION_TIRES',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_code: 'OTHERS',
    },
  ];

  await insertOrUpsertTable(queryRunner, 'part_types', ['part_type_id'], data);
};
