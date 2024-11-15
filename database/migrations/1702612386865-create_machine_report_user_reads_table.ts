import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class CreateMachineReportUserReadsTable1702612386865
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'machine_report_user_reads',
                columns: [
                    new TableColumn({
                        name: 'machine_report_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'read_at',
                        type: 'DATETIME2',
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
            //machine_report_user_reads
            {
                keys: [['user_id', 'user_id', 'users']],
                table: 'machine_report_user_reads',
            },
            {
                keys: [
                    [
                        'machine_report_id',
                        'machine_report_id',
                        'machine_reports',
                    ],
                ],
                table: 'machine_report_user_reads',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(
            'machine_report_user_reads',
            true,
            true,
            true,
        );
    }
}
