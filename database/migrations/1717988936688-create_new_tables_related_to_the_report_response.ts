import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNewTablesRelatedToTheReportResponse1717988936688
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //machine_operation_reports
        await queryRunner.createTable(
            new Table({
                name: 'machine_operation_reports',
                columns: [
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'start_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'end_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'operation_details',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    },
                    {
                        name: 'comment	',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    },
                ],
            }),
        );

        //fuel_maintenance_reports
        await queryRunner.createTable(
            new Table({
                name: 'fuel_maintenance_reports',
                columns: [
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'work_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'service_meter_in_hour',
                        type: 'DECIMAL(8,1)',
                    },
                ],
            }),
        );

        //fuel_refills
        await queryRunner.createTable(
            new Table({
                name: 'fuel_refills',
                columns: [
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'fuel_in_liters',
                        type: 'DECIMAL(10,3)',
                    },
                    {
                        name: 'is_adblue_refilled',
                        type: 'BIT',
                    },
                    {
                        name: 'comment',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    },
                ],
            }),
        );

        //oil_coolant_refill_exchanges
        await queryRunner.createTable(
            new Table({
                name: 'oil_coolant_refill_exchanges',
                columns: [
                    {
                        name: 'oil_coolant_refill_exchange_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'oil_type_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'action_type',
                        type: 'VARCHAR',
                        length: '64',
                        enum: ['REFILL', 'EXCHANGE'],
                    },
                    {
                        name: 'fluid_in_liters',
                        type: 'DECIMAL(10,3)',
                    },
                    {
                        name: 'comment',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    },
                ],
            }),
        );

        //oil_types
        await queryRunner.createTable(
            new Table({
                name: 'oil_types',
                columns: [
                    {
                        name: 'oil_type_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'oil_type_code',
                        type: 'VARCHAR',
                        length: '64',
                    },
                ],
            }),
        );

        //oil_type_translations
        await queryRunner.createTable(
            new Table({
                name: 'oil_type_translations',
                columns: [
                    {
                        name: 'oil_type_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        enum: ['en', 'ja', 'ur', 'ar', 'pt', 'es'],
                        isPrimary: true,
                        default: `'en'`,
                    },
                    {
                        name: 'oil_type_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );

        //part_replacements
        await queryRunner.createTable(
            new Table({
                name: 'part_replacements',
                columns: [
                    {
                        name: 'part_replacement_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'part_type_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'content',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    },
                ],
            }),
        );

        //part_types
        await queryRunner.createTable(
            new Table({
                name: 'part_types',
                columns: [
                    {
                        name: 'part_type_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'part_type_code',
                        type: 'VARCHAR',
                        length: '64',
                    },
                ],
            }),
        );

        //part_type_translations
        await queryRunner.createTable(
            new Table({
                name: 'part_type_translations',
                columns: [
                    {
                        name: 'part_type_id',
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
                        name: 'part_type_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );

        //part_replacement_medias
        await queryRunner.createTable(
            new Table({
                name: 'part_replacement_medias',
                columns: [
                    {
                        name: 'part_replacement_media_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'part_replacement_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'file_name',
                        type: 'NVARCHAR',
                        length: '255',
                    },
                    {
                        name: 'media_url',
                        type: 'VARCHAR',
                        length: '512',
                    },
                    {
                        name: 'mime_type',
                        type: 'VARCHAR',
                        length: '64',
                    },
                    {
                        name: 'created_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('machine_operation_reports', true, true);
        await queryRunner.dropTable('fuel_maintenance_reports', true, true);
        await queryRunner.dropTable('fuel_refills', true, true);
        await queryRunner.dropTable('oil_coolant_refill_exchanges', true, true);
        await queryRunner.dropTable('oil_types', true, true);
        await queryRunner.dropTable('oil_type_translations', true, true);
        await queryRunner.dropTable('part_replacements', true, true);
        await queryRunner.dropTable('part_types', true, true);
        await queryRunner.dropTable('part_type_translations', true, true);
        await queryRunner.dropTable('part_replacement_medias', true, true);
    }
}
