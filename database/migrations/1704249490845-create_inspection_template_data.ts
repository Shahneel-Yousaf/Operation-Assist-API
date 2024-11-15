import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    inspectionFormTemplateTemplateData,
    inspectionFormTemplateTranslationTemplateData,
    inspectionItemTemplateTemplateData,
    inspectionItemTemplateTranslationTemplateData,
    machineTypeInspectionFormTemplateTemplateData,
} from '../template-data';

export class CreateInspectionTemplateData1704249490845
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await inspectionFormTemplateTemplateData(queryRunner);
        await inspectionFormTemplateTranslationTemplateData(queryRunner);
        await inspectionItemTemplateTemplateData(queryRunner);
        await inspectionItemTemplateTranslationTemplateData(queryRunner);
        await machineTypeInspectionFormTemplateTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('inspection_form_templates');
        await queryRunner.clearTable('inspection_form_template_translations');
        await queryRunner.clearTable('inspection_item_templates');
        await queryRunner.clearTable('inspection_item_template_translations');
        await queryRunner.clearTable('machine_type_inspection_form_templates');
    }
}
