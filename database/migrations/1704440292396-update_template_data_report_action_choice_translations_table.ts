import { MigrationInterface, QueryRunner } from 'typeorm';

import { reportActionChoiceTranslationTemplateData } from '../template-data';

export class UpdateTemplateDataReportActionChoiceTranslationsTable1704440292396
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await reportActionChoiceTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM report_action_choice_translations',
        );
    }
}
