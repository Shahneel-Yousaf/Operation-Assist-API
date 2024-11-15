import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMaintenanceReportTables1719908376462
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //maintenance_reports
        await queryRunner.createTable(
            new Table({
                name: 'maintenance_reports',
                columns: [
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'comment',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    },
                    {
                        name: 'service_meter_in_hour',
                        type: 'DECIMAL(8,1)',
                    },
                    {
                        name: 'work_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'regular_maintenance_item_choice_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'maintenance_reason_choice_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'maintenance_reason_period_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    },
                ],
            }),
        );

        //maintenance_report_irregular_maintenance_items
        await queryRunner.createTable(
            new Table({
                name: 'maintenance_report_irregular_maintenance_items',
                columns: [
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'irregular_maintenance_item_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                ],
            }),
        );

        //irregular_maintenance_item_choices
        await queryRunner.createTable(
            new Table({
                name: 'irregular_maintenance_item_choices',
                columns: [
                    {
                        name: 'irregular_maintenance_item_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'irregular_maintenance_item_choice_code',
                        type: 'VARCHAR',
                        length: '64',
                        isUnique: true,
                    },
                    {
                        name: 'position',
                        type: 'INT',
                    },
                    {
                        name: 'is_disabled',
                        type: 'BIT',
                    },
                ],
            }),
        );

        //irregular_maintenance_item_choice_translations
        await queryRunner.createTable(
            new Table({
                name: 'irregular_maintenance_item_choice_translations',
                columns: [
                    {
                        name: 'irregular_maintenance_item_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        default: `'en'`,
                        enum: ['en', 'ja', 'ur', 'ar', 'pt', 'es'],
                        isPrimary: true,
                    },
                    {
                        name: 'irregular_maintenance_item_choice_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );

        //regular_maintenance_item_choices
        await queryRunner.createTable(
            new Table({
                name: 'regular_maintenance_item_choices',
                columns: [
                    {
                        name: 'regular_maintenance_item_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'regular_maintenance_item_choice_code',
                        type: 'VARCHAR',
                        length: '64',
                        isUnique: true,
                    },
                    {
                        name: 'position',
                        type: 'INT',
                    },
                    {
                        name: 'is_disabled',
                        type: 'BIT',
                    },
                ],
            }),
        );

        //regular_maintenance_item_choice_translations
        await queryRunner.createTable(
            new Table({
                name: 'regular_maintenance_item_choice_translations',
                columns: [
                    {
                        name: 'regular_maintenance_item_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        default: `'en'`,
                        enum: ['en', 'ja', 'ur', 'ar', 'pt', 'es'],
                        isPrimary: true,
                    },
                    {
                        name: 'regular_maintenance_item_choice_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );

        //maintenance_reason_period_choices
        await queryRunner.createTable(
            new Table({
                name: 'maintenance_reason_period_choices',
                columns: [
                    {
                        name: 'maintenance_reason_period_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'maintenance_reason_period_choice_code',
                        type: 'VARCHAR',
                        length: '64',
                        isUnique: true,
                    },
                ],
            }),
        );

        //maintenance_reason_period_choice_translations
        await queryRunner.createTable(
            new Table({
                name: 'maintenance_reason_period_choice_translations',
                columns: [
                    {
                        name: 'maintenance_reason_period_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        default: `'en'`,
                        enum: ['en', 'ja', 'ur', 'ar', 'pt', 'es'],
                        isPrimary: true,
                    },
                    {
                        name: 'maintenance_reason_period_choice_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );

        //maintenance_reason_choices
        await queryRunner.createTable(
            new Table({
                name: 'maintenance_reason_choices',
                columns: [
                    {
                        name: 'maintenance_reason_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'maintenance_reason_choice_code',
                        type: 'VARCHAR',
                        length: '64',
                        isUnique: true,
                    },
                ],
            }),
        );

        //maintenance_reason_choice_translations
        await queryRunner.createTable(
            new Table({
                name: 'maintenance_reason_choice_translations',
                columns: [
                    {
                        name: 'maintenance_reason_choice_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        default: `'en'`,
                        enum: ['en', 'ja', 'ur', 'ar', 'pt', 'es'],
                        isPrimary: true,
                    },
                    {
                        name: 'maintenance_reason_choice_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('maintenance_reports', true, true);
        await queryRunner.dropTable(
            'maintenance_report_irregular_maintenance_items',
            true,
            true,
        );
        await queryRunner.dropTable(
            'irregular_maintenance_item_choices',
            true,
            true,
        );
        await queryRunner.dropTable(
            'irregular_maintenance_item_choice_translations',
            true,
            true,
        );
        await queryRunner.dropTable(
            'regular_maintenance_item_choices',
            true,
            true,
        );
        await queryRunner.dropTable(
            'regular_maintenance_item_choice_translations',
            true,
            true,
        );
        await queryRunner.dropTable(
            'maintenance_reason_period_choices',
            true,
            true,
        );
        await queryRunner.dropTable(
            'maintenance_reason_period_choice_translations',
            true,
            true,
        );
        await queryRunner.dropTable('maintenance_reason_choices', true, true);
        await queryRunner.dropTable(
            'maintenance_reason_choice_translations',
            true,
            true,
        );
    }
}
