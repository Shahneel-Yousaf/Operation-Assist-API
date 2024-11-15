import { MigrationInterface, QueryRunner } from 'typeorm';

import { maintenanceReasonChoiceTranslationTemplateData } from '../template-data';

export class UpdateMaintenanceReasonChoiceTemplateTranslationData1721881170109
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
        await maintenanceReasonChoiceTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
    }
}
