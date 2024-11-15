import { MigrationInterface, QueryRunner } from 'typeorm';

import { inspectionFormTemplateTranslationTemplateJAData } from '../template-data';

export class UpdateInspectionTemplateJAName1712820781742
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTranslationTemplateJAData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
