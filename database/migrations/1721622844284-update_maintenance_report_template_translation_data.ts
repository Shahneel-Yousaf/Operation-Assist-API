import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    irregularMaintenanceItemChoiceTranslationTemplateData,
    maintenanceReasonChoiceTranslationTemplateData,
    maintenanceReasonPeriodChoiceTranslationTemplateData,
    regularMaintenanceItemChoiceTranslationTemplateData,
} from '../template-data';

export class UpdateMaintenanceReportTemplateTranslationData1721622844284
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM regular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM irregular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_period_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
        await regularMaintenanceItemChoiceTranslationTemplateData(queryRunner);
        await irregularMaintenanceItemChoiceTranslationTemplateData(
            queryRunner,
        );
        await maintenanceReasonChoiceTranslationTemplateData(queryRunner);
        await maintenanceReasonPeriodChoiceTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM regular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM irregular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_period_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
    }
}
