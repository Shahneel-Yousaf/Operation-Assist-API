import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const regularMaintenanceItemChoiceTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    regular_maintenance_item_choice_id: string;
    iso_locale_code: string;
    regular_maintenance_item_choice_name: string;
  }[] = [
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Every 100h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Every 100, 500h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Every 100, 500, 2000h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Every 500h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Every 500, 1000h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name:
        'Every 500, 1000, 2000h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Every 500, 4500h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name:
        'Every 500, 1000, 4500h maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Maintenance when required only',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      iso_locale_code: 'en',
      regular_maintenance_item_choice_name: 'Long-term storage maintenance',
    },
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '100時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '100・500時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '100・500・2000時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '500時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '500・1000時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '500・1000・2000時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '500・4500時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '500・1000・4500時間毎整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '不定期メンテナンスのみ',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      iso_locale_code: 'ja',
      regular_maintenance_item_choice_name: '長期保管中の整備',
    },
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name: 'Mantenimiento cada 100h',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name: 'Mantenimiento cada 100, 500h',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name:
        'Mantenimiento cada 100, 500, 2000h',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name: 'Mantenimiento cada 500h',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name: 'Mantenimiento cada 500, 1000h',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name:
        'Mantenimiento cada 500, 1000, 2000h',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name: 'Mantenimiento cada 500, 4500h',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name:
        'Mantenimiento cada 500, 1000, 4500h',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name:
        'Mantenimiento solo cuando sea necesario',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      iso_locale_code: 'es',
      regular_maintenance_item_choice_name:
        'Mantenimiento de maquinaria por inactividad prolongada',
    },
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name: 'A cada 100h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name: 'A cada 100, 500h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name:
        'A cada 100, 500, 2000h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name: 'A cada 500h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name: 'A cada 500, 1000h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name:
        'Cada 500, 1000, 2000h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name: 'Cada 500, 4500h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name:
        'Cada 500, 1000, 4500h de manutenção',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name:
        'Manutenção apenas quando necessário',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      iso_locale_code: 'pt',
      regular_maintenance_item_choice_name:
        'Manutenção de armazenamento por longo período',
    },
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'ہر 100 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'ہر 100، 500 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name:
        'ہر 100، 500، 2000 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'ہر 500 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'ہر 500، 1000 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name:
        'ہر 500، 1000، 2000 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'ہر 500، 4500 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name:
        'ہر 500، 1000، 4500 گھنٹے کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'دیکھ بھال صرف ضرورت کے وقت',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      iso_locale_code: 'ur',
      regular_maintenance_item_choice_name: 'طویل مدتی اسٹوریج کی دیکھ بھال',
    },
    {
      regular_maintenance_item_choice_id: '01J1VTCXBG083S10XJCKHV2E9W',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 100 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV65FBGT9QF0Y43DEC8AQE',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 100 ، 500 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8HG9XVG3R1EYPRKYBHCX',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 500 ، 1000، 2000 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8QZ1Z7WS7D5T3XZT7ZNR',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 500 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV8XJ4EFG8QH2BGA2BNF5A',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 500 ، 1000 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1VV934S9TSX4G0H7BSGN47N',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 500 ، 1000، 2000 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB7XB41SPNP59DTCYD58MP',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 500 ، 4500 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB870P60GHS39EA98666GD',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة كل 500 ، 1000 ، 4500 ساعة',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8DNCBRKTVM4N9FW8HC1H',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة عند الحاجة فقط',
    },
    {
      regular_maintenance_item_choice_id: '01J1ZB8KJVWVCT0SHE36CJZPRF',
      iso_locale_code: 'ar',
      regular_maintenance_item_choice_name: 'صيانة التخزين لمدة طويلة',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'regular_maintenance_item_choice_translations',
    ['regular_maintenance_item_choice_id'],
    data,
  );
};
