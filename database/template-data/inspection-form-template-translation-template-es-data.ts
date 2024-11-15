import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const inspectionFormTemplateTranslationTemplateESData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    inspection_form_template_id: string;
    iso_locale_code: string;
    inspection_form_template_name: string;
  }[] = [
    {
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Formulario de inspección común a todas las máquina',
    },
    {
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Excabadora',
    },
    {
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Cargador frontal',
    },
    {
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Buldózer',
    },
    {
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Motoniveladora',
    },
    {
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Camión rigido',
    },
    {
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Camión articulado',
    },
    {
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Retroexcavadora',
    },
    {
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Carretilla elevadora(eléctrico)',
    },
    {
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Carretilla elevadora(Motor)',
    },
    {
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Excavadora sobre ruedas',
    },
    {
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Mini-cargador',
    },
    {
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
      iso_locale_code: 'es',
      inspection_form_template_name: 'Trituradora movil',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'inspection_form_template_translations',
    ['inspection_form_template_id', 'iso_locale_code'],
    data,
  );
};
