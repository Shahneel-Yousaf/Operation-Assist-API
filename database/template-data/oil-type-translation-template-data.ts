import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const oilTypeTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    oil_type_id: string;
    oil_type_name: string;
    iso_locale_code: string;
  }[] = [
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_name: 'Engine oil',
      iso_locale_code: 'en',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_name: 'Hydraulic oil',
      iso_locale_code: 'en',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_name: 'Transmission oil',
      iso_locale_code: 'en',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_name: 'Cooling water',
      iso_locale_code: 'en',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_name: 'Other',
      iso_locale_code: 'en',
    },
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_name: 'エンジンオイル',
      iso_locale_code: 'ja',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_name: '作動油',
      iso_locale_code: 'ja',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_name: 'トランスミッションオイル',
      iso_locale_code: 'ja',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_name: '冷却水',
      iso_locale_code: 'ja',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_name: 'その他',
      iso_locale_code: 'ja',
    },
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_name: 'Aceite de motor',
      iso_locale_code: 'es',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_name: 'Aceite hidráulico',
      iso_locale_code: 'es',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_name: 'Aceite de la transmisión',
      iso_locale_code: 'es',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_name: 'Agua de refrigeración',
      iso_locale_code: 'es',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_name: 'Otros',
      iso_locale_code: 'es',
    },
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_name: 'Óleo de motor',
      iso_locale_code: 'pt',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_name: 'Óleo hidráulico',
      iso_locale_code: 'pt',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_name: 'Óleo de transmissão',
      iso_locale_code: 'pt',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_name: 'Água de refrigeração',
      iso_locale_code: 'pt',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_name: 'Outros',
      iso_locale_code: 'pt',
    },
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_name: 'انجن کا تیل',
      iso_locale_code: 'ur',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_name: 'ہائیڈرولک تیل',
      iso_locale_code: 'ur',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_name: 'ٹرانسمیشن تیل',
      iso_locale_code: 'ur',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_name: 'ٹھنڈا پانی',
      iso_locale_code: 'ur',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_name: 'دوسرے',
      iso_locale_code: 'ur',
    },
    {
      oil_type_id: '065D0EV3QJM8PKAVMA8Z0E5G3N',
      oil_type_name: 'زيت المحرك',
      iso_locale_code: 'ar',
    },
    {
      oil_type_id: '065D0EV5H7YX8B2FBSW4X2MWNQ',
      oil_type_name: 'الزيت الهيدروليكي',
      iso_locale_code: 'ar',
    },
    {
      oil_type_id: '065D0EV7TG14C6HJA5FV7J3ZCP',
      oil_type_name: 'زيت ناقل الحركة',
      iso_locale_code: 'ar',
    },
    {
      oil_type_id: '065D0EVAZPWVH9HWB2RJY1Q8ST',
      oil_type_name: 'مياه التبريد',
      iso_locale_code: 'ar',
    },
    {
      oil_type_id: '065D0EVCE3BZB7ZPBVG9X2H6NK',
      oil_type_name: 'آحرون',
      iso_locale_code: 'ar',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'oil_type_translations',
    ['oil_type_id', 'iso_locale_code'],
    data,
  );
};
