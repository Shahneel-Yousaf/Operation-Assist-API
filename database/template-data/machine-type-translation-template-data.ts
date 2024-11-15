import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const machineTypeTranslationTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    machine_type_id: string;
    iso_locale_code: string;
    type_name: string;
  }[] = [
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      type_name: 'Crawler excavator',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      type_name: 'Wheel loader',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      type_name: 'Crawler dozer',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      type_name: 'Rigid dump truck',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      type_name: 'Articulated dump truck',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      type_name: 'Motor grader',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      type_name: 'Wheel-type excavator',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      type_name: 'Forklift',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      type_name: 'Backhoe loader',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      type_name: 'Skid steer loader',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      type_name: 'Mobile crusher',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      type_name: 'Others',
      iso_locale_code: 'en-US',
    },
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      type_name: '油圧ショベル',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      type_name: 'ホイールローダー',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      type_name: 'ブルドーザー',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      type_name: 'ダンプトラック',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      type_name: 'アーティキュレートダンプトラック',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      type_name: 'モーターグレーダー',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      type_name: 'タイヤ式油圧ショベル',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      type_name: 'フォークリフト',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      type_name: 'バックホーローダ―',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      type_name: 'スキッドステアローダー',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      type_name: 'モバイルクラッシャ',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      type_name: 'その他',
      iso_locale_code: 'ja',
    },
    {
      machine_type_id: '0661J7JX5D7J7BH8MS4M14KEEW',
      type_name: 'Excabadora',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX5DGBT31R2WD1TSC4PM',
      type_name: 'Cargador frontal',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX5DSNHWH21EZZVBJ150',
      type_name: 'Buldózer',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX5DXH6E3YD3KC9EAJHG',
      type_name: 'Camión rigido',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX5EAFPV1FFBPZ62YA88',
      type_name: 'Camión articulado',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX5EM9EHA53YEV7SRE8M',
      type_name: 'Motoniveladora',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX6W3970X6PDHTA7SX38',
      type_name: 'Excavadora sobre ruedas',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX6W4JGWN8QRHV6GHWFG',
      type_name: 'Carretilla elevadora',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX6WXCVEWV3CGVZ3QJEM',
      type_name: 'Retroexcavadora',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX6X9XGHBZTQJGTQXBDM',
      type_name: 'Mini-cargador',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX6YB8MWJ7H0NKA2QAKW',
      type_name: 'Trituradora movil',
      iso_locale_code: 'es-CL',
    },
    {
      machine_type_id: '0661J7JX6ZDP4HXM46349GPFHW',
      type_name: 'Otros',
      iso_locale_code: 'es-CL',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'machine_type_translations',
    ['machine_type_id', 'iso_locale_code'],
    data,
  );
};
