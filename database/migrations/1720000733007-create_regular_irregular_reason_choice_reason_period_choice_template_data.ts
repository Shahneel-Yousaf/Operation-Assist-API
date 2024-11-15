import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    irregularMaintenanceItemChoiceTemplateData,
    irregularMaintenanceItemChoiceTranslationTemplateData,
    maintenanceReasonChoiceTemplateData,
    maintenanceReasonChoiceTranslationTemplateData,
    maintenanceReasonPeriodChoiceTemplateData,
    maintenanceReasonPeriodChoiceTranslationTemplateData,
    regularMaintenanceItemChoiceTemplateData,
    regularMaintenanceItemChoiceTranslationTemplateData,
} from '../template-data';

export class CreateRegularIrregularReasonChoiceReasonPeriodChoiceTemplateData1720000733007
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await regularMaintenanceItemChoiceTemplateData(queryRunner);
        await regularMaintenanceItemChoiceTranslationTemplateData(queryRunner);
        await irregularMaintenanceItemChoiceTemplateData(queryRunner);
        await irregularMaintenanceItemChoiceTranslationTemplateData(
            queryRunner,
        );
        await maintenanceReasonChoiceTemplateData(queryRunner);
        await maintenanceReasonChoiceTranslationTemplateData(queryRunner);
        await maintenanceReasonPeriodChoiceTemplateData(queryRunner);
        await maintenanceReasonPeriodChoiceTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM regular_maintenance_item_choices');
        await queryRunner.query(
            'DELETE FROM regular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM irregular_maintenance_item_choices',
        );
        await queryRunner.query(
            'DELETE FROM irregular_maintenance_item_choice_translations',
        );
        await queryRunner.query('DELETE FROM maintenance_reason_choices');
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_period_choices',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_period_choice_translations',
        );
    }
}
