import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateMachineReportHistories1702608431572
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create machine_report_histories table
        await queryRunner.createTable(
            new Table({
                name: 'machine_report_histories',
                columns: [
                    new TableColumn({
                        name: 'machine_report_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'machine_report_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
                    }),
                    new TableColumn({
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    }),
                    new TableColumn({
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'report_title',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                    new TableColumn({
                        name: 'first_report_comment',
                        type: 'NVARCHAR',
                        length: 'MAX',
                    }),
                    new TableColumn({
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['POSTED', 'UPDATED', 'DRAFT'],
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(
            'machine_report_histories',
            true,
            true,
            true,
        );
    }
}
