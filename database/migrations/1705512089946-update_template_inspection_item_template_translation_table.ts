import { MigrationInterface, QueryRunner } from 'typeorm';

import { inspectionItemTemplateTranslationTemplateData } from '../template-data';

export class UpdateTemplateInspectionItemTemplateTranslationTable1705512089946
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
        await inspectionItemTemplateTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
    }
}
