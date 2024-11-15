import { MigrationInterface, QueryRunner } from 'typeorm';

import { inspectionFormTemplateTranslationTemplateESData } from '../template-data';

export class UpdateInspectionFormTemplateEsName1717051782351
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTranslationTemplateESData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
