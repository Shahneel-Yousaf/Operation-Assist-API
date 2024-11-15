import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionFormTemplateTranslationTemplateARData,
    inspectionFormTemplateTranslationTemplateENData,
    inspectionFormTemplateTranslationTemplateESData,
    inspectionFormTemplateTranslationTemplateJAData,
    inspectionFormTemplateTranslationTemplatePTData,
    inspectionFormTemplateTranslationTemplateURData,
} from '../template-data';

export class UpdateInspectionFormTemplateTranslations1716792952193
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTranslationTemplateARData(queryRunner);
        await inspectionFormTemplateTranslationTemplateJAData(queryRunner);
        await inspectionFormTemplateTranslationTemplateENData(queryRunner);
        await inspectionFormTemplateTranslationTemplateESData(queryRunner);
        await inspectionFormTemplateTranslationTemplatePTData(queryRunner);
        await inspectionFormTemplateTranslationTemplateURData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
