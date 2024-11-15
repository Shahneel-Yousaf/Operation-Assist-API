import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const machineTypeInspectionFormTemplateTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    machine_type_id: string;
    inspection_form_template_id: string;
  }[] = [
    //1
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
    },
    //2
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
    },
    //3
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
    },
    //4
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
    },
    //5
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
    },
    //6
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
    },
    //7
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
    },
    //8
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
    },
    //9
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
    },
    //10
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
    },
    //11
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
    },
    //12
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'machine_type_inspection_form_templates',
    ['machine_type_id', 'inspection_form_template_id'],
    data,
  );
};
