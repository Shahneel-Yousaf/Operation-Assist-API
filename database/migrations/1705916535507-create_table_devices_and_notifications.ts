import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class CreateTableDevicesAndNotifications1705916535507
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create devices table
        await queryRunner.createTable(
            new Table({
                name: 'devices',
                columns: [
                    new TableColumn({
                        name: 'device_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'device_type',
                        type: 'VARCHAR',
                        length: '64',
                        enum: ['IOS', 'ANDROID'],
                    }),
                    new TableColumn({
                        name: 'fcm_token',
                        type: 'VARCHAR',
                        length: '255',
                    }),
                    new TableColumn({
                        name: 'last_active_at',
                        type: 'DATETIME2',
                    }),
                    new TableColumn({
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                    }),
                    new TableColumn({
                        name: 'last_status_updated_at',
                        type: 'DATETIME2',
                    }),
                ],
            }),
            true,
        );

        // Create notifications table
        await queryRunner.createTable(
            new Table({
                name: 'notifications',
                columns: [
                    new TableColumn({
                        name: 'notification_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'content_code',
                        type: 'VARCHAR',
                        length: '64',
                        enum: [
                            'INSPECTION_POSTED',
                            'MACHINE_REPORT_POSTED',
                            'MACHINE_REPORT_UPDATED_AND_UNADDRESSED',
                            'MACHINE_REPORT_UPDATED_AND_RESOLVED',
                        ],
                    }),
                    new TableColumn({
                        name: 'content_data',
                        type: 'VARCHAR',
                        length: 'MAX',
                        default: "'{}'",
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'inspection_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'machine_report_response_id',
                        type: 'CHAR',
                        length: '26',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'sent_at',
                        type: 'DATETIME2',
                    }),
                    new TableColumn({
                        name: 'status',
                        type: 'VARCHAR',
                        enum: ['SENT', 'FAILED', 'QUEUED'],
                        length: '64',
                    }),
                    new TableColumn({
                        name: 'error_code',
                        type: 'VARCHAR',
                        length: '128',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'retry_count',
                        type: 'INT',
                        default: 0,
                    }),
                    new TableColumn({
                        name: 'retry_after_sec',
                        type: 'INT',
                        default: 60,
                    }),
                ],
            }),
            true,
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //devices
            {
                keys: [['user_id', 'user_id', 'users']],
                table: 'devices',
            },
            //notifications
            {
                keys: [['user_id', 'user_id', 'users']],
                table: 'notifications',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('devices', true, true, true);
        await queryRunner.dropTable('notifications', true, true, true);
    }
}
