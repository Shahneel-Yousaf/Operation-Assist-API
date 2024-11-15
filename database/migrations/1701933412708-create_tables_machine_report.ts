import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateTablesMachineReport1701933412708
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // machine_reports
        await queryRunner.createTable(
            new Table({
                name: 'machine_reports',
                columns: [
                    new TableColumn({
                        name: 'machine_report_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'report_title',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                    new TableColumn({
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'RESOLVED', 'OPEN', 'CLOSED'],
                        default: "'OPEN'",
                    }),
                    new TableColumn({
                        name: 'inspection_result_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                ],
            }),
            true,
        );

        // machine_report_responses
        await queryRunner.createTable(
            new Table({
                name: 'machine_report_responses',
                columns: [
                    new TableColumn({
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'report_comment',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    }),
                    new TableColumn({
                        name: 'commented_at',
                        type: 'DATETIME2',
                        default: 'GETDATE()',
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['OPEN', 'RESOLVED', 'CLOSED'],
                        default: "'OPEN'",
                    }),
                    new TableColumn({
                        name: 'lat',
                        type: 'DECIMAL(10,7)',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'lng',
                        type: 'DECIMAL(10,7)',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'machine_report_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'location_accuracy',
                        type: 'VARCHAR',
                        length: '32',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'device_platform',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['IOS', 'ANDROID'],
                        isNullable: true,
                    }),
                ],
            }),
            true,
        );

        // machine_report_pictures
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

        // report_action_choices
        await queryRunner.createTable(
            new Table({
                name: 'report_action_choices',
                columns: [
                    new TableColumn({
                        name: 'report_action_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'report_action_choice_code',
                        type: 'VARCHAR',
                        length: '64',
                    }),
                ],
            }),
            true,
        );

        // report_action_choice_translations
        await queryRunner.createTable(
            new Table({
                name: 'report_action_choice_translations',
                columns: [
                    new TableColumn({
                        name: 'report_action_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        isPrimary: true,
                        enum: ['ja', 'es-CL', 'en-US'],
                        default: "'en-US'",
                    }),
                    new TableColumn({
                        name: 'report_action_choice_name',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                ],
            }),
            true,
        );

        // report_actions
        await queryRunner.createTable(
            new Table({
                name: 'report_actions',
                columns: [
                    new TableColumn({
                        name: 'report_action_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'action_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    }),
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // machine_reports
        await queryRunner.dropTable('machine_reports', true, true, true);

        // machine_report_responses
        await queryRunner.dropTable(
            'machine_report_responses',
            true,
            true,
            true,
        );

        // machine_report_pictures
        await queryRunner.dropTable(
            'machine_report_pictures',
            true,
            true,
            true,
        );

        // report_action_choices
        await queryRunner.dropTable('report_action_choices', true, true, true);

        // report_action_choice_translations
        await queryRunner.dropTable(
            'report_action_choice_translations',
            true,
            true,
            true,
        );

        // report_actions
        await queryRunner.dropTable('report_actions', true, true, true);
    }
}
