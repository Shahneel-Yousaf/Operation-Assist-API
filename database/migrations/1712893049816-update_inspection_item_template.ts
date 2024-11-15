import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionItemTemplateTranslationTemplateARData,
    inspectionItemTemplateTranslationTemplatePTData,
    inspectionItemTemplateTranslationTemplateURData,
} from '../template-data';

export class UpdateInspectionItemTemplate1712893049816
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionItemTemplateTranslationTemplatePTData(queryRunner);
        await inspectionItemTemplateTranslationTemplateARData(queryRunner);
        await inspectionItemTemplateTranslationTemplateURData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
    }
}
