import { QueryRunner } from 'typeorm';

import { insertOrUpsertTable } from '../commons/functions';

export const updatePermissionTranslateTemplateData = async (
  queryRunner: QueryRunner,
) => {
  const data: {
    permission_id: string;
    iso_locale_code: string;
    permission_name: string;
  }[] = [
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'en',
      permission_name: 'Inspect machine and register report',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'en',
      permission_name: 'Create/edit/delete inspection form',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'en',
      permission_name: 'Add/edit/remove machine',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'en',
      permission_name: 'Add member/edit permissions/delete',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'en',
      permission_name: 'Edit/delete group',
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
      iso_locale_code: 'es',
      permission_name: 'Inspeccionar la máquina y registrar el informe.',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'es',
      permission_name: 'Crear, editar y eliminar reporte de inspección',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'es',
      permission_name: 'Agregar/editar/eliminar máquina',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'es',
      permission_name: 'Agregar, editar autoridad, eliminar miembro.',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'es',
      permission_name: 'Editar/eliminar grupo',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'pt',
      permission_name: 'Inspecionar a máquina e registrar o relatório',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'pt',
      permission_name: 'Criar/editar/excluir folha de inspeção',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'pt',
      permission_name: 'Adicionar/editar/remover máquina',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'pt',
      permission_name: 'Adicionar membro/editar permissões/excluir',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'pt',
      permission_name: 'Editar/excluir grupo',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'ur',
      permission_name: 'مشین کا معائنہ کریں اور رپورٹ رجسٹر کریں',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'ur',
      permission_name: 'تخلیق/ترمیم/حذف معائنہ شیٹ',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'ur',
      permission_name: 'مشین شامل کریں / ترمیم کریں / ہٹائیں',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'ur',
      permission_name: 'رکن شامل کریں/اجازت نامے ترمیم کریں/حذف کریں',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'ur',
      permission_name: 'گروپ کو ترمیم کریں / حذف کریں',
    },
    {
      permission_id: '065BDR71D53H2ZBB5RA7334MC4',
      iso_locale_code: 'ar',
      permission_name: 'تفقد الآلة وسجل التقرير',
    },
    {
      permission_id: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
      iso_locale_code: 'ar',
      permission_name: 'إنشاء / تعديل / حذف ورقة الفحص',
    },
    {
      permission_id: '065BDR8DCB6M7H3E25336KH3ZC',
      iso_locale_code: 'ar',
      permission_name: 'أضف / عدل / أزل الآلة',
    },
    {
      permission_id: '065BDR92ZNGHX3R18CANF69Z00',
      iso_locale_code: 'ar',
      permission_name: 'أضف عضوًا / عدل الأذونات / حذف',
    },
    {
      permission_id: '065BDR92ZSK8KXMJZBQKKS9YFX',
      iso_locale_code: 'ar',
      permission_name: 'تعديل / حذف المجموعة',
    },
  ];

  await insertOrUpsertTable(
    queryRunner,
    'permission_translations',
    ['permission_id', 'iso_locale_code'],
    data,
  );
};
