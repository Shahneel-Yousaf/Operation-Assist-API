import { MigrationInterface, QueryRunner } from 'typeorm';

import { updateReportActionChoiceTranslationTemplateData } from '../template-data';

export class UpdateReportActionChoiceTranslations1712559093825
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await updateReportActionChoiceTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM report_action_choice_translations',
        );
    }
}
