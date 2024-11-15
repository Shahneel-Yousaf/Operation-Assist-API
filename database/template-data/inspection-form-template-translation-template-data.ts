import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const inspectionFormTemplateTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    inspection_form_template_id: string;
    iso_locale_code: string;
    inspection_form_template_name: string;
  }[] = [
    {
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'General',
    },
    {
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Crawler excavator',
    },
    {
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Wheel loader',
    },
    {
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Crawler dozer',
    },
    {
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Motor grader',
    },
    {
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Rigid dump truck',
    },
    {
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Articulated dump truck',
    },
    {
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Backhoe loader',
    },
    {
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Electric forklift',
    },
    {
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Internal combustion forklift',
    },
    {
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Wheel excavator',
    },
    {
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Skid steer loader',
    },
    {
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
      iso_locale_code: 'en-US',
      inspection_form_template_name: 'Mobile crusher',
    },
    {
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
      iso_locale_code: 'ja',
      inspection_form_template_name: '共通',
    },
    {
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
      iso_locale_code: 'ja',
      inspection_form_template_name: '油圧ショベル',
    },
    {
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'ホイールローダ',
    },
    {
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'ブルドーザ',
    },
    {
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'モータグレーダ',
    },
    {
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'ダンプトラック',
    },
    {
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'アーティキュレートダンプトラック',
    },
    {
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'バックホーローダ',
    },
    {
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'フォークリフト(バッテリ)',
    },
    {
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'フォークリフト(エンジン)',
    },
    {
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'タイヤ式油圧ショベル',
    },
    {
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'スキッドステアローダ',
    },
    {
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
      iso_locale_code: 'ja',
      inspection_form_template_name: 'モバイルクラッシャ',
    },
    {
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'General',
    },
    {
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Excabadora',
    },
    {
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Cargador frontal',
    },
    {
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Buldózer',
    },
    {
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Motoniveladora',
    },
    {
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Camión rigido',
    },
    {
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Camión articulado',
    },
    {
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Retroexcavadora',
    },
    {
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Carretilla elevadora(eléctrico)',
    },
    {
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Carretilla elevadora(Motor)',
    },
    {
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Excavadora sobre ruedas',
    },
    {
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
      iso_locale_code: 'es-CL',
      inspection_form_template_name: 'Mini-cargador',
    },
    {
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
      iso_locale_code: 'es-CL',
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
