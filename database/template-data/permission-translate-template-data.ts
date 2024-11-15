import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const permissionTranslateTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    permission_id: string;
    iso_locale_code: string;
    permission_name: string;
  }[] = [
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'en-US',
      permission_name: 'Inspect machine and register report',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'en-US',
      permission_name: 'Create / edit / delete  inspection sheet',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'en-US',
      permission_name: 'Add / edit / remove machine',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'en-US',
      permission_name: 'Add member/edit authority/delete',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'en-US',
      permission_name: 'Edit / delete group',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'ja',
      permission_name: '車両の点検、報告の登録',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'ja',
      permission_name: '点検表の作成・編集・削除',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'ja',
      permission_name: '車両の追加・編集・削除',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'ja',
      permission_name: 'メンバーの追加・権限編集・削除',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'ja',
      permission_name: 'グループの編集・削除',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'es-CL',
      permission_name: 'Inspeccionar la máquina y registrar el informe.',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'es-CL',
      permission_name: 'Crear, editar y eliminar listas de verificación',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'es-CL',
      permission_name: 'Agregar/editar/eliminar máquina',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'es-CL',
      permission_name: 'Agregar miembro/editar autoridad/eliminar',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'es-CL',
      permission_name: 'Editar/eliminar grupo',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'permission_translations',
    ['permission_id', 'iso_locale_code'],
    data,
  );
};
