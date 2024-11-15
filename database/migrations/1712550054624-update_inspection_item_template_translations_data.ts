import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionItemTemplateTranslationTemplateENData,
    inspectionItemTemplateTranslationTemplateESData,
    inspectionItemTemplateTranslationTemplateJAData,
    inspectionItemTemplateTranslationTemplatePTData,
} from '../template-data';

export class UpdateInspectionItemTemplateTranslationsData1712550054624
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionItemTemplateTranslationTemplateENData(queryRunner);
        await inspectionItemTemplateTranslationTemplateESData(queryRunner);
        await inspectionItemTemplateTranslationTemplateJAData(queryRunner);
        await inspectionItemTemplateTranslationTemplatePTData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
    }
}
