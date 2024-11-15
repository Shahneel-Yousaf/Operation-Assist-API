import { MigrationInterface, QueryRunner } from 'typeorm';

import { maintenanceReasonChoiceTranslationTemplateData } from '../template-data';

export class UpdateMaintenanceReasonChoiceTranslationTemplateData1723174221314
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await maintenanceReasonChoiceTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM maintenance_reason_choice_translations',
        );
    }
}
