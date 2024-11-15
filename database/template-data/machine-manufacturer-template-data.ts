import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const machineManufacturerTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    machine_manufacturer_id: string;
    machine_manufacturer_name: string;
  }[] = [
    {
      machine_manufacturer_id: '0661ATBN7XH5EB1NXCFDF4ZTMG',
      machine_manufacturer_name: 'KOMATSU',
    },
    {
      machine_manufacturer_id: '0661ATBN9C2F1MZW2BTQBQR0D4',
      machine_manufacturer_name: 'ATLAS COPCO',
    },
    {
      machine_manufacturer_id: '0661ATBN9C7A2H6SB7Y0BNS82M',
      machine_manufacturer_name: 'BOBCAT',
    },
    {
      machine_manufacturer_id: '0661ATBN9C9K4PHH0XVAW42K0G',
      machine_manufacturer_name: 'BOMAG',
    },
    {
      machine_manufacturer_id: '0661ATBN9CAFX3C79PN7FMG7M4',
      machine_manufacturer_name: 'CATERPILLAR',
    },
    {
      machine_manufacturer_id: '0661ATBN9CFZR0VV21ZBPBSQSW',
      machine_manufacturer_name: 'CASE',
    },
    {
      machine_manufacturer_id: '0661ATBN9CNA9HTPYFEF099GFM',
      machine_manufacturer_name: 'DYNAPAC',
    },
    {
      machine_manufacturer_id: '0661ATBN9CNAC9EKBQR100N7YW',
      machine_manufacturer_name: 'DOOSAN',
    },
    {
      machine_manufacturer_id: '0661ATBN9CV0F9NCXBA5HVW0B0',
      machine_manufacturer_name: 'FURUKAWA',
    },
    {
      machine_manufacturer_id: '0661ATBN9CXX9YYRHW81KE7K1R',
      machine_manufacturer_name: 'HITACHI',
    },
    {
      machine_manufacturer_id: '0661ATBN9DBKJ85WSMKVPQ64T8',
      machine_manufacturer_name: 'HYUNDAI',
    },
    {
      machine_manufacturer_id: '0661ATBN9DC29W45HYV522VTY8',
      machine_manufacturer_name: 'INGERSOLL RAND',
    },
    {
      machine_manufacturer_id: '0661ATBN9DE5VJ029PHEJJ2QA4',
      machine_manufacturer_name: 'JCB',
    },
    {
      machine_manufacturer_id: '0661ATBN9DFRPQPAXG0CHH3JQG',
      machine_manufacturer_name: 'JOHN DEERE',
    },
    {
      machine_manufacturer_id: '0661ATBN9DN1YBVAETMS4DMWHM',
      machine_manufacturer_name: 'KATO',
    },
    {
      machine_manufacturer_id: '0661ATBN9DR7R2PNGDEYJ4K0ZM',
      machine_manufacturer_name: 'KOBELCO',
    },
    {
      machine_manufacturer_id: '0661ATBN9DRD0TQCEVD0RMNAQM',
      machine_manufacturer_name: 'KUBOTA',
    },
    {
      machine_manufacturer_id: '0661ATBN9DT6910X067HT13MRW',
      machine_manufacturer_name: 'LIEBHERR',
    },
    {
      machine_manufacturer_id: '0661ATBN9E01YRGMM0JTFQGZN0',
      machine_manufacturer_name: 'LIUGONG',
    },
    {
      machine_manufacturer_id: '0661ATBN9E33QX1VJ0PBW75CSG',
      machine_manufacturer_name: 'MAEDA',
    },
    {
      machine_manufacturer_id: '0661ATBN9ECMA18589D606J0MR',
      machine_manufacturer_name: 'MITSUBISHI',
    },
    {
      machine_manufacturer_id: '0661ATBN9EKC6ENA7EDS9Z2ZZG',
      machine_manufacturer_name: 'NEW HOLLAND',
    },
    {
      machine_manufacturer_id: '0661ATBN9EMA4YT0MD9V8CB0PC',
      machine_manufacturer_name: 'SAKAI',
    },
    {
      machine_manufacturer_id: '0661ATBN9EVYKYYTEE6FXJ5YMW',
      machine_manufacturer_name: 'SANDVIK',
    },
    {
      machine_manufacturer_id: '0661ATBN9EZWDZW0VQVN5Z2JX8',
      machine_manufacturer_name: 'SANY',
    },
    {
      machine_manufacturer_id: '0661ATBN9F3AMKPRENGAE6FWNM',
      machine_manufacturer_name: 'SENNEBOGEN',
    },
    {
      machine_manufacturer_id: '0661ATBN9F5PJNAB38EHWZP1CW',
      machine_manufacturer_name: 'SHANTUI',
    },
    {
      machine_manufacturer_id: '0661ATBN9F6HGS71HEMQSJH4GM',
      machine_manufacturer_name: 'SUMITOMO',
    },
    {
      machine_manufacturer_id: '0661ATBN9F7S7H5AZFW00AQP40',
      machine_manufacturer_name: 'TADANO',
    },
    {
      machine_manufacturer_id: '0661ATBN9F9RTKSYKBZ651KZK4',
      machine_manufacturer_name: 'TAKEUCHI',
    },
    {
      machine_manufacturer_id: '0661ATBN9FEQJAZJA02PSHBKP8',
      machine_manufacturer_name: 'TEREX',
    },
    {
      machine_manufacturer_id: '0661ATBNB0TEPH7ANC230DSWMR',
      machine_manufacturer_name: 'VOLVO',
    },
    {
      machine_manufacturer_id: '0661ATBNB270ME2FMV4JT6PTBW',
      machine_manufacturer_name: 'WRITGEN',
    },
    {
      machine_manufacturer_id: '0661ATBNB34BZXZHB79N5EBNRW',
      machine_manufacturer_name: 'XCMG',
    },
    {
      machine_manufacturer_id: '0661ATBNB3693SBNTZQ2Y1M3ZR',
      machine_manufacturer_name: 'YANMAR',
    },
    {
      machine_manufacturer_id: '0661ATBNB37RW8C4D5QPP3CGBM',
      machine_manufacturer_name: 'ZOOMLION',
    },
    {
      machine_manufacturer_id: '0665TE1NFG6ZXQXXYYNY15V0NW',
      machine_manufacturer_name: 'OTHERS',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'machine_manufacturers',
    ['machine_manufacturer_id'],
    data,
  );
};
