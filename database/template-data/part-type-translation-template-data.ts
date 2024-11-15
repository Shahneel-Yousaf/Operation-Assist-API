import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const partTypeTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    part_type_id: string;
    part_type_name: string;
    iso_locale_code: string;
  }[] = [
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_name: 'Filters (engine related)',
      iso_locale_code: 'en',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_name: 'Filters (body related)',
      iso_locale_code: 'en',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_name: 'Work equipment',
      iso_locale_code: 'en',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_name: 'Suspension/tires',
      iso_locale_code: 'en',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_name: 'Other',
      iso_locale_code: 'en',
    },
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_name: 'フィルター(エンジン関連)',
      iso_locale_code: 'ja',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_name: 'フィルター(車体関連)',
      iso_locale_code: 'ja',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_name: '作業機',
      iso_locale_code: 'ja',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_name: '足回り/タイヤ',
      iso_locale_code: 'ja',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_name: 'その他',
      iso_locale_code: 'ja',
    },
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_name: 'Filtro (relacionado con el motor)',
      iso_locale_code: 'es',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_name: 'Filtro (relacionado con el cuerpo del automóvil)',
      iso_locale_code: 'es',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_name: 'Maquinaria de trabajo',
      iso_locale_code: 'es',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_name: 'Suspensión/Neumático',
      iso_locale_code: 'es',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_name: 'Otros',
      iso_locale_code: 'es',
    },
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_name: 'Filtro (relacionado ao motor)',
      iso_locale_code: 'pt',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_name: 'Filtro (relacionado ao corpo do veículo)',
      iso_locale_code: 'pt',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_name: 'Máquinas de trabalho',
      iso_locale_code: 'pt',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_name: 'Suspensão/Pneus',
      iso_locale_code: 'pt',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_name: 'Outros',
      iso_locale_code: 'pt',
    },
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_name: 'فلٹر (انجن سے متعلق)',
      iso_locale_code: 'ur',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_name: 'فلٹر (کار باڈی سے متعلق)',
      iso_locale_code: 'ur',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_name: 'کام کا سامان',
      iso_locale_code: 'ur',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_name: 'کام کا سامان',
      iso_locale_code: 'ur',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_name: 'دوسرے',
      iso_locale_code: 'ur',
    },
    {
      part_type_id: '065D0EVF4K10W9GRY4PV9X3MLF',
      part_type_name: 'الفلتر (متعلق بالمحرك)',
      iso_locale_code: 'ar',
    },
    {
      part_type_id: '065D0EVH9PNJG15ZQ3TA6M7RQG',
      part_type_name: 'الفلتر (متعلق بجسم السيارة)',
      iso_locale_code: 'ar',
    },
    {
      part_type_id: '065D0EVKD8F4M9WTR6VQY4LK3B',
      part_type_name: 'معدات العمل',
      iso_locale_code: 'ar',
    },
    {
      part_type_id: '065D0EVNEX0T58ZRQXWA5B9FYL',
      part_type_name: 'التعليق/الإطارات',
      iso_locale_code: 'ar',
    },
    {
      part_type_id: '065D0EVQH0L3K1YXV7TYZ7MT2G',
      part_type_name: 'آحرون',
      iso_locale_code: 'ar',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'part_type_translations',
    ['part_type_id', 'iso_locale_code'],
    data,
  );
};
