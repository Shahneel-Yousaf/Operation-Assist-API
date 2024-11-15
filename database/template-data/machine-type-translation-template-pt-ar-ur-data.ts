import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const machineTypeTranslationTemplatePtArUrData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    machine_type_id: string;
    iso_locale_code: string;
    type_name: string;
  }[] = [
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      type_name: 'Escavadeira hidráulica',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      type_name: 'Carregadeira de rodas',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      type_name: 'Trator de esteiras',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      type_name: 'Caminhão basculante rígido',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      type_name: 'Caminhão basculante articulado',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      type_name: 'Motoniveladora',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      type_name: 'Escavadeira de rodas',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      type_name: 'Empilhadeira',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      type_name: 'Retroescavadeira',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      type_name: 'Minicarregadeira',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      type_name: 'Britador móvel',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      type_name: 'Outros',
      iso_locale_code: 'pt',
    },
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      type_name: 'ہائیڈرولک ایکسکیویٹر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      type_name: 'وہیل لوڈر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      type_name: 'بلڈوزر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      type_name: 'سخت ڈمپ ٹرک',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      type_name: 'متحرک ڈمپ ٹرک',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      type_name: 'موٹر گریڈر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      type_name: 'وہیل ٹائپ ایکسکیویٹرز',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      type_name: 'فورک لفٹ',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      type_name: 'بیکہو لوڈر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      type_name: 'اسکِڈ اسٹیر لوڈر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      type_name: 'موبائل کرشر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      type_name: 'دیگر',
      iso_locale_code: 'ur',
    },
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      type_name: 'حفار هيدروليكي',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      type_name: 'لودر بعجلات',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      type_name: 'جرافة',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      type_name: 'شاحنة قلابة صلبة',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      type_name: 'شاحنة قلابة مفصلية',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      type_name: 'ممهدة',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      type_name: 'حفارات بعجلات',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      type_name: 'رافعة شوكية',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      type_name: 'لودر حفار',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      type_name: 'لودر ذو توجيه انزلاقي',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      type_name: 'كسارة متنقلة',
      iso_locale_code: 'ar',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      type_name: 'آخرون',
      iso_locale_code: 'ar',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'machine_type_translations',
    ['machine_type_id', 'iso_locale_code'],
    data,
  );
};
