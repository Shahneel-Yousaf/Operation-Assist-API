import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const oilTypeTemplateData = async (queryRunner: QueryRunner) => {
  const data: {
    oil_type_id: string;
    oil_type_code: string;
  }[] = [
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_code: 'ENGINE_OIL',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_code: 'HYDRAULIC_OIL',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_code: 'TRANSMISSION_OIL',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_code: 'COOLING_WATER',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_code: 'OTHERS',
    },
  ];

  await insertOrUpsertTable(queryRunner, 'oil_types', ['oil_type_id'], data);
};
