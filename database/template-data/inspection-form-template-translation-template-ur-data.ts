import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const inspectionFormTemplateTranslationTemplateURData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    inspection_form_template_id: string;
    iso_locale_code: string;
    inspection_form_template_name: string;
  }[] = [
    {
      inspection_form_template_id: '01HK75F5HZFJ44679AV6H115CW',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'تمام مشینوں کے لیے عام معائنہ فارم',
    },
    {
      inspection_form_template_id: '01HK75FPW6960DGWSMP1QQT7RD',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'ہائیڈرولک ایکسکیویٹر',
    },
    {
      inspection_form_template_id: '01HK75G5R0H69C2NWY3ARKJWV4',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'وہیل لوڈر',
    },
    {
      inspection_form_template_id: '01HK75GHE53EM9QXT0J9WVZF6Z',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'بلڈوزر',
    },
    {
      inspection_form_template_id: '01HK75GXBXWM0JTA19E4WWZB0C',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'موٹر گریڈر',
    },
    {
      inspection_form_template_id: '01HK75H7JSF9KAXZJZVNVXWYJP',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'سخت ڈمپ ٹرک',
    },
    {
      inspection_form_template_id: '01HK75HW616W08FE29SHVGS14F',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'متحرک ڈمپ ٹرک',
    },
    {
      inspection_form_template_id: '01HK75J702NPW1TFFAQB13P6ND',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'بیکہو لوڈر',
    },
    {
      inspection_form_template_id: '01HK75JFSVWHEVTWYVHEBBHZS5',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'فورک لفٹ',
    },
    {
      inspection_form_template_id: '01HK75JV46Q1HV6F7XBR8V1NKA',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'فورک لفٹ',
    },
    {
      inspection_form_template_id: '01HK75K7HB9CVNGSP4MWRZERXB',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'وہیل ٹائپ ایکسکیویٹرز',
    },
    {
      inspection_form_template_id: '01HK75KH58B8GM11NT1EBJFWPT',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'اسکِڈ اسٹیر لوڈر',
    },
    {
      inspection_form_template_id: '01HK75KTXQ83MWNP8TA8YNZGXA',
      iso_locale_code: 'ur',
      inspection_form_template_name: 'موبائل کرشر',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'inspection_form_template_translations',
    ['inspection_form_template_id', 'iso_locale_code'],
    data,
  );
};
