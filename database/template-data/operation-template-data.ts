import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const operationTemplateData = async (queryRunner: QueryRunner) => {
  const data: { operation_id: string; operation_code: string }[] = [
    {
      operation_id: '065BBWVZV2KJHBD0WT6T33NQZ8',
      operation_code: 'READ_CREATE',
    },
    {
      operation_id: '065BBX2QS18WK5G1SKSFDXC080',
      operation_code: 'READ_CREATE_UPDATE',
    },
    {
      operation_id: '065BBX3HVZSKTRRN15NYCTX064',
      operation_code: 'READ_CREATE_UPDATE_DELETE',
    },
    {
      operation_id: '065BBX3MSQE1Y5VSARRJ8076R7',
      operation_code: 'UPDATE_DELETE',
    },
  ];

  await insertOrUpsertTable(queryRunner, 'operations', ['operation_id'], data);
};
