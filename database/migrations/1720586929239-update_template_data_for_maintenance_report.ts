import {
    irregularMaintenanceItemChoiceTranslationTemplateData,
    maintenanceReasonChoiceTranslationTemplateData,
    regularMaintenanceItemChoiceTemplateData,
    regularMaintenanceItemChoiceTranslationTemplateData,
} from '../template-data';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTemplateDataForMaintenanceReport1720586929239
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM regular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM irregular_maintenance_item_choice_translations',
        );
        await regularMaintenanceItemChoiceTemplateData(queryRunner);
        await regularMaintenanceItemChoiceTranslationTemplateData(queryRunner);
        await maintenanceReasonChoiceTranslationTemplateData(queryRunner);
        await irregularMaintenanceItemChoiceTranslationTemplateData(
            queryRunner,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM regular_maintenance_item_choices');
        await queryRunner.query(
            'DELETE FROM regular_maintenance_item_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
        await queryRunner.query(
            'DELETE FROM irregular_maintenance_item_choice_translations',
        );
    }
}
