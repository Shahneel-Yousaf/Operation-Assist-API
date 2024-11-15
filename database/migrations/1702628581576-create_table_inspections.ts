import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableInspections1702628581576 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // inspections
        await queryRunner.createTable(
            new Table({
                name: 'inspections',
                columns: [
                    {
                        name: 'inspection_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'inspection_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'lat',
                        type: 'DECIMAL(10,7)',
                        isNullable: true,
                    },
                    {
                        name: 'lng',
                        type: 'DECIMAL(10,7)',
                        isNullable: true,
                    },
                    {
                        name: 'location_accuracy',
                        type: 'VARCHAR',
                        length: '32',
                        isNullable: true,
                    },
                    {
                        name: 'device_platform',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['IOS', 'ANDROID'],
                        isNullable: true,
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'POSTED'],
                    },
                    {
                        name: 'last_status_updated_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'custom_inspection_form_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    },
                ],
            }),
        );

        // inspection_results
        await queryRunner.createTable(
            new Table({
                name: 'inspection_results',
                columns: [
                    {
                        name: 'inspection_result_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'result',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'inspection_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'custom_inspection_item_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                    },
                    {
                        name: 'last_status_updated_at',
                        type: 'DATETIME2',
                        isNullable: true,
                    },
                ],
            }),
        );

        // inspection_result_histories
        await queryRunner.createTable(
            new Table({
                name: 'inspection_result_histories',
                columns: [
                    {
                        name: 'inspection_result_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
                    },
                    {
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'inspection_result_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'result',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'inspection_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'custom_inspection_item_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                    },
                ],
            }),
        );

        // inspection_histories
        await queryRunner.createTable(
            new Table({
                name: 'inspection_histories',
                columns: [
                    {
                        name: 'inspection_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
                    },
                    {
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'inspection_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'inspection_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'lat',
                        type: 'DECIMAL(10,7)',
                        isNullable: true,
                    },
                    {
                        name: 'lng',
                        type: 'DECIMAL(10,7)',
                        isNullable: true,
                    },
                    {
                        name: 'location_accuracy',
                        type: 'VARCHAR',
                        length: '32',
                        isNullable: true,
                    },
                    {
                        name: 'device_platform',
                        type: 'VARCHAR',
                        length: '32',
                        isNullable: true,
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'POSTED'],
                    },
                    {
                        name: 'custom_inspection_form_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    },
                ],
            }),
        );

        // custom_inspection_forms
        await queryRunner.createTable(
            new Table({
                name: 'custom_inspection_forms',
                columns: [
                    {
                        name: 'custom_inspection_form_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'PUBLISHED', 'DELETED'],
                    },
                    {
                        name: 'last_status_updated_at',
                        type: 'DATETIME2',
                    },
                ],
            }),
        );

        // custom_inspection_form_histories
        await queryRunner.createTable(
            new Table({
                name: 'custom_inspection_form_histories',
                columns: [
                    {
                        name: 'custom_inspection_form_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
                    },
                    {
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'PUBLISHED', 'DELETED'],
                    },
                    {
                        name: 'custom_inspection_form_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    },
                ],
            }),
        );

        // custom_inspection_items
        await queryRunner.createTable(
            new Table({
                name: 'custom_inspection_items',
                columns: [
                    {
                        name: 'custom_inspection_item_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'description',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'result_type',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['OK_OR_ANOMARY', 'NUMERIC'],
                    },
                    {
                        name: 'is_required',
                        type: 'BIT',
                        default: 0,
                    },
                    {
                        name: 'is_immutable',
                        type: 'BIT',
                        default: 0,
                    },
                    {
                        name: 'is_forced_required',
                        type: 'BIT',
                        default: 0,
                    },
                    {
                        name: 'position',
                        type: 'INT',
                        isUnique: true,
                        default: 0,
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'PUBLISHED', 'DELETED'],
                    },
                    {
                        name: 'last_status_updated_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'custom_inspection_form_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    },
                ],
            }),
        );

        // custom_inspection_item_medias
        await queryRunner.createTable(
            new Table({
                name: 'custom_inspection_item_medias',
                columns: [
                    {
                        name: 'custom_inspection_item_media_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'custom_inspection_item_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'file_name',
                        type: 'NVARCHAR',
                        length: '128',
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

        // custom_inspection_item_histories
        await queryRunner.createTable(
            new Table({
                name: 'custom_inspection_item_histories',
                columns: [
                    {
                        name: 'custom_inspection_item_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
                    },
                    {
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'custom_inspection_item_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'description',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                    {
                        name: 'result_type',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['OK_OR_ANOMARY', 'NUMERIC'],
                    },
                    {
                        name: 'is_required',
                        type: 'BIT',
                        default: 0,
                    },
                    {
                        name: 'is_immutable',
                        type: 'BIT',
                        default: 0,
                    },
                    {
                        name: 'is_forced_required',
                        type: 'BIT',
                        default: 0,
                    },
                    {
                        name: 'position',
                        type: 'INT',
                        isUnique: true,
                        default: 0,
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['DRAFT', 'PUBLISHED', 'DELETED'],
                    },
                    {
                        name: 'custom_inspection_form_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // inspections
        await queryRunner.dropTable('inspections', true, true, true);
        // inspection_results
        await queryRunner.dropTable('inspection_results', true, true, true);
        // inspection_result_histories
        await queryRunner.dropTable(
            'inspection_result_histories',
            true,
            true,
            true,
        );
        // inspection_histories
        await queryRunner.dropTable('inspection_histories', true, true, true);
        // custom_inspection_forms
        await queryRunner.dropTable(
            'custom_inspection_forms',
            true,
            true,
            true,
        );
        // custom_inspection_form_histories
        await queryRunner.dropTable(
            'custom_inspection_form_histories',
            true,
            true,
            true,
        );
        // custom_inspection_items
        await queryRunner.dropTable(
            'custom_inspection_items',
            true,
            true,
            true,
        );
        // custom_inspection_item_medias
        await queryRunner.dropTable(
            'custom_inspection_item_medias',
            true,
            true,
            true,
        );
        // custom_inspection_item_histories
        await queryRunner.dropTable(
            'custom_inspection_item_histories',
            true,
            true,
            true,
        );
    }
}
