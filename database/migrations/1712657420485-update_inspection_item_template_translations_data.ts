import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionItemTemplateTranslationTemplateARData,
    inspectionItemTemplateTranslationTemplateURData,
} from '../template-data';

export class UpdateInspectionItemTemplateTranslationsData1712657420485
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionItemTemplateTranslationTemplateARData(queryRunner);
        await inspectionItemTemplateTranslationTemplateURData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
    }
}
