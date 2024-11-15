import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionItemTemplateTranslationTemplateESData,
    inspectionItemTemplateTranslationTemplatePTData,
} from '../template-data';

export class UpdateInspectionItemTemplateTranslationsData1713511012775
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionItemTemplateTranslationTemplatePTData(queryRunner);
        await inspectionItemTemplateTranslationTemplateESData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
    }
}
