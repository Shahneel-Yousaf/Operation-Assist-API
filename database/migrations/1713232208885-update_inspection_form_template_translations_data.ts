import { MigrationInterface, QueryRunner } from 'typeorm';

import { inspectionFormTemplateTranslationTemplatePTData } from '../template-data';

export class UpdateInspectionFormTemplateTranslationsData1713232208885
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTranslationTemplatePTData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
