import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const irregularMaintenanceItemChoiceTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    irregular_maintenance_item_choice_id: string;
    iso_locale_code: string;
    irregular_maintenance_item_choice_name: string;
  }[] = [
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Air cleaner cleaning',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Air cleaner replacement',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Coolant refill',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Coolant replacement',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Check the battery',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Oil clinic',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name: 'Rust-proof operation',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      iso_locale_code: 'en',
      irregular_maintenance_item_choice_name:
        'Others (provide detailed in comment)',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: 'エアクリーナー清掃',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: 'エアクリーナー交換',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: '冷却水補充',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: '冷却水交換',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: 'バッテリ点検',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: 'オイルクリニック実施',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: '防錆運転',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      iso_locale_code: 'ja',
      irregular_maintenance_item_choice_name: 'その他（詳細コメント記載）',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Limpieza del filtro de aire',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Reemplazo del filtro de aire',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Relleno de refrigerante',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Reemplazo de refrigerante',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Revisar la batería',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Clínica de aceite',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name: 'Operación prueba de óxido',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      iso_locale_code: 'es',
      irregular_maintenance_item_choice_name:
        'Otros (proporcionar detalles en el comentario)',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name: 'Limpeza do filtro de ar',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name: 'Substituição do filtro de ar',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name:
        'Recarga do líquido de arrefecimento',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name:
        'Substituição do líquido de arrefecimento',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name: 'Verificar a bateria',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name: 'Análise de óleo',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name: 'Operação à prova de ferrugem',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      iso_locale_code: 'pt',
      irregular_maintenance_item_choice_name:
        'Outros (informar detalhes em comentários)',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'ایئر کلینر کی صفائی',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'ایئر کلینر کی تبدیلی',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'کولنٹ کو دوبارہ بھرنا',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'کولنٹ کی تبدیلی',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'بیٹری چیک کریں۔',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'آئل کلینک',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'زنگ پروف آپریشن',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      iso_locale_code: 'ur',
      irregular_maintenance_item_choice_name: 'دیگر (تفصیل تبصرے میں دیں)',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKP7QWPJ0DSYFGJZ66YZM',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'تنظيف فلتر الهواء',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVKZ6VG4NN4T4ENXG702SH',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'تغيير فلتر الهواء',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVM78Z9NHTR471603GR4VC',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'إعادة تعبئة سائل التبريد',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMCQ1TD1RQCGDJW3HCQ0M',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'تغيير سائل التبريد',
    },
    {
      irregular_maintenance_item_choice_id: '01J1VVMHV8KE1ZZC0VC67JQDGJ',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'إفحص البطارية',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZBZR45A0EMYB10P9H4GV3G',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'فحص ضغوطات الزيت',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC01052K3NDMY9WQHNAEMM',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'عمليه مقاومة للصدأ',
    },
    {
      irregular_maintenance_item_choice_id: '01J1ZC06Q0EXB5RBNQXVNQ3V6W',
      iso_locale_code: 'ar',
      irregular_maintenance_item_choice_name: 'أخرى (التفاصيل فى التعليق)',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'irregular_maintenance_item_choice_translations',
    ['irregular_maintenance_item_choice_id'],
    data,
  );
};
