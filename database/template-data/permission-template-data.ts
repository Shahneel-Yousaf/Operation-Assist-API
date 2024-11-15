import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const permissionTemplateData = async (queryRunner: QueryRunner) => {
  const data: {
    permission_id: string;
    resource_id: string;
    operation_id: string;
  }[] = [
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      resource_id: '065BBX65G14M29P07VHX8EWBP4',
      operation_id: '065BBWVZV2KJHBD0WT6T33NQZ8',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      resource_id: '065BBX6WV598SDNNXXKR64Z2PC',
      operation_id: '065BBX2QS18WK5G1SKSFDXC080',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      resource_id: '065BBX7PNYSNCKC0ZFQ21E5QT8',
      operation_id: '065BBX3HVZSKTRRN15NYCTX064',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      resource_id: '065BDHVY7MYC4JJ7BBZM4M9DD4',
      operation_id: '065BBX3HVZSKTRRN15NYCTX064',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      resource_id: '065BDHWHZ35YWNX7AHKX6K2X3G',
      operation_id: '065BBX3MSQE1Y5VSARRJ8076R7',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'permissions',
    ['permission_id'],
    data,
  );
};
