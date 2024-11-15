import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionFormTemplateTranslationTemplateENData,
    inspectionFormTemplateTranslationTemplateESData,
    inspectionFormTemplateTranslationTemplateJAData,
    inspectionFormTemplateTranslationTemplatePTData,
} from '../template-data';

export class UpdateInspectionFormTemplateTranslationsData1712550031197
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTranslationTemplateJAData(queryRunner);
        await inspectionFormTemplateTranslationTemplateENData(queryRunner);
        await inspectionFormTemplateTranslationTemplateESData(queryRunner);
        await inspectionFormTemplateTranslationTemplatePTData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
