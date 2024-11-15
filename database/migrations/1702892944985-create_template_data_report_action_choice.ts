import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import {
    reportActionChoiceTemplateData,
    reportActionChoiceTranslationTemplateData,
} from '../template-data';

export class CreateTemplateDataReportActionChoice1702892944985
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // report action choice template data
        await reportActionChoiceTemplateData(queryRunner);
        // report action choice translation template data
        await reportActionChoiceTranslationTemplateData(queryRunner);

        // drop table machine_report_pictures
        await queryRunner.dropTable(
            'machine_report_pictures',
            true,
            true,
            true,
        );

        // machine_report_medias
        await queryRunner.createTable(
            new Table({
                name: 'machine_report_medias',
                columns: [
                    new TableColumn({
                        name: 'machine_report_media_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'file_name',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                    new TableColumn({
                        name: 'media_url',
                        type: 'VARCHAR',
                        length: '512',
                    }),
                    new TableColumn({
                        name: 'mime_type',
                        type: 'VARCHAR',
                        length: '64',
                    }),
                    new TableColumn({
                        name: 'created_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    }),
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_type_translations');
        await queryRunner.query(
            'DELETE FROM report_action_choice_translations',
        );

        await queryRunner.createTable(
            new Table({
                name: 'machine_report_pictures',
                columns: [
                    new TableColumn({
                        name: 'machine_report_picture_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'file_name',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                    new TableColumn({
                        name: 'picture_url',
                        type: 'VARCHAR',
                        length: '512',
                    }),
                    new TableColumn({
                        name: 'created_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    }),
                ],
            }),
            true,
        );

        await queryRunner.dropTable('machine_report_medias', true, true, true);
    }
}
