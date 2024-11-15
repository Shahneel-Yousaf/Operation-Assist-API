import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const resourceTemplateData = async (queryRunner: QueryRunner) => {
  const data: { resource_id: string; resource_code: string }[] = [
    {
      resource_id: '065BBX65G14M29P07VHX8EWBP4',
      resource_code: 'INSPECTIONS_AND_MACHINE_REPORTS',
    },
    {
      resource_id: '065BBX6WV598SDNNXXKR64Z2PC',
      resource_code: 'CUSTOM_INSPECTION_FORMS',
    },
    {
      resource_id: '065BBX7PNYSNCKC0ZFQ21E5QT8',
      resource_code: 'MACHINES',
    },
    {
      resource_id: '065BDHVY7MYC4JJ7BBZM4M9DD4',
      resource_code: 'USER_GROUP_ASSIGNMENTS',
    },
    {
      resource_id: '065BDHWHZ35YWNX7AHKX6K2X3G',
      resource_code: 'GROUPS',
    },
  ];

  await insertOrUpsertTable(queryRunner, 'resources', ['resource_id'], data);
};
