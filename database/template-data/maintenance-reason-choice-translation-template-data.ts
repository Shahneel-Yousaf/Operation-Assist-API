import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const maintenanceReasonChoiceTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    maintenance_reason_choice_id: string;
    iso_locale_code: string;
    maintenance_reason_choice_name: string;
  }[] = [
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      iso_locale_code: 'en',
      maintenance_reason_choice_name: 'Service meter/SMR elapsed',
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      iso_locale_code: 'en',
      maintenance_reason_choice_name: 'Time period elapsed',
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      iso_locale_code: 'en',
      maintenance_reason_choice_name: 'When required',
    },
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      iso_locale_code: 'ja',
      maintenance_reason_choice_name: 'サービスメーター/SMR経過',
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      iso_locale_code: 'ja',
      maintenance_reason_choice_name: '期間経過',
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      iso_locale_code: 'ja',
      maintenance_reason_choice_name: '不定期',
    },
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      iso_locale_code: 'es',
      maintenance_reason_choice_name: 'Horómetro (SMR) transcurrido',
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      iso_locale_code: 'es',
      maintenance_reason_choice_name: 'Periodo de tiempo transcurrido',
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      iso_locale_code: 'es',
      maintenance_reason_choice_name: 'Cuando sea necesario',
    },
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      iso_locale_code: 'pt',
      maintenance_reason_choice_name: 'Horímetro/SMR expirado',
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      iso_locale_code: 'pt',
      maintenance_reason_choice_name: 'Tempo decorrido',
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      iso_locale_code: 'pt',
      maintenance_reason_choice_name: 'Quando necessário',
    },
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      iso_locale_code: 'ur',
      maintenance_reason_choice_name: 'سروس میٹر/SMR گزر گیا۔',
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      iso_locale_code: 'ur',
      maintenance_reason_choice_name: 'وقت کا دورانیہ گزر گئی۔',
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      iso_locale_code: 'ur',
      maintenance_reason_choice_name: 'جب ضرورت ہو',
    },
    {
      maintenance_reason_choice_id: '01J1VXMZTKE987Y011207JWDCX',
      iso_locale_code: 'ar',
      maintenance_reason_choice_name: 'ساعات التشغيل / ساعات التشغيل المنقضية',
    },
    {
      maintenance_reason_choice_id: '01J1VXN50PQV3WVP84FRPXYR5R',
      iso_locale_code: 'ar',
      maintenance_reason_choice_name: 'انقضت الفترة الزمنية',
    },
    {
      maintenance_reason_choice_id: '01J1VXN9HHD7KRVR0EZKAR20QC',
      iso_locale_code: 'ar',
      maintenance_reason_choice_name: 'عند الحاجة',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'maintenance_reason_choice_translations',
    ['maintenance_reason_choice_id', 'iso_locale_code'],
    data,
  );
};
