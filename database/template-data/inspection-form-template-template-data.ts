import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const inspectionFormTemplateTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    inspection_form_template_id: string;
    created_at: string;
  }[] = [
    {
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
      created_at: '2024-01-02',
    },
    {
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
      created_at: '2024-01-02',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'inspection_form_templates',
    ['inspection_form_template_id'],
    data,
  );
};
