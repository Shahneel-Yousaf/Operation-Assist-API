import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionFormTemplateTranslationTemplateARData,
    inspectionFormTemplateTranslationTemplateURData,
} from '../template-data';

export class UpdateInspectionFormTemplateTranslationsData1712657411459
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTranslationTemplateARData(queryRunner);
        await inspectionFormTemplateTranslationTemplateURData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
