import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionFormTemplateTranslationTemplateData,
    inspectionItemTemplateTemplateData1705975344125,
    inspectionItemTemplateTranslationTemplateData,
} from '../template-data';

export class UpdateTemplateInspectionItemAndFormTemplateTranslationTable1709708547191
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
        await queryRunner.query('DELETE FROM inspection_item_templates');
        await inspectionItemTemplateTemplateData1705975344125(queryRunner);
        await inspectionItemTemplateTranslationTemplateData(queryRunner);
        await inspectionFormTemplateTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM inspection_item_template_translations',
        );
        await queryRunner.query(
            'DELETE FROM inspection_form_template_translations',
        );
        await queryRunner.query('DELETE FROM inspection_item_templates');
    }
}
