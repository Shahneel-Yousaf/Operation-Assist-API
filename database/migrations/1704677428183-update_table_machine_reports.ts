import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateTableMachineReports1704677428183
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('machine_reports', [
            new TableColumn({
                name: 'last_status_updated_at',
                type: 'DATETIME2',
                default: 'CURRENT_TIMESTAMP',
            }),
            new TableColumn({
                name: 'first_machine_report_response_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'last_machine_report_response_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        ]);

        await queryRunner.addColumns('machine_report_histories', [
            new TableColumn({
                name: 'first_machine_report_response_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'last_machine_report_response_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        ]);

        await queryRunner.query(`
            UPDATE machine_reports
            SET first_machine_report_response_id = (
                SELECT TOP 1 machine_report_response_id
                FROM machine_report_responses
                WHERE machine_reports.machine_report_id = machine_report_id
                ORDER BY commented_at ASC
            ),
            last_machine_report_response_id = (
                SELECT TOP 1 machine_report_response_id
                FROM machine_report_responses
                WHERE machine_reports.machine_report_id = machine_report_id
                ORDER BY commented_at DESC
            );
        `);

        await queryRunner.query(`
            UPDATE mh
            SET
                mh.first_machine_report_response_id = mr.first_machine_report_response_id,
                mh.last_machine_report_response_id = mr.last_machine_report_response_id
            FROM
                machine_report_histories mh
            INNER JOIN
                machine_reports mr ON mh.machine_report_id = mr.machine_report_id;        
        `);

        await queryRunner.query(
            'ALTER TABLE machine_reports ALTER COLUMN first_machine_report_response_id CHAR(26) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_reports ALTER COLUMN last_machine_report_response_id CHAR(26) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_histories ALTER COLUMN first_machine_report_response_id CHAR(26) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_histories ALTER COLUMN last_machine_report_response_id CHAR(26) NOT NULL;',
        );

        await queryRunner.dropColumn('machine_reports', 'first_report_comment');

        await queryRunner.dropColumn(
            'machine_report_histories',
            'first_report_comment',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('machine_reports', [
            'last_status_updated_at',
            'first_machine_report_response_id',
            'last_machine_report_response_id',
        ]);

        await queryRunner.dropColumns('machine_report_histories', [
            'first_machine_report_response_id',
            'last_machine_report_response_id',
        ]);

        await queryRunner.addColumns('machine_reports', [
            new TableColumn({
                name: 'first_report_comment',
                type: 'NVARCHAR(MAX)',
                isNullable: true,
            }),
        ]);

        await queryRunner.addColumns('machine_report_histories', [
            new TableColumn({
                name: 'first_report_comment',
                type: 'NVARCHAR(MAX)',
                isNullable: true,
            }),
        ]);

        await queryRunner.query(`
            UPDATE machine_reports
            SET first_report_comment = (
                SELECT TOP 1 report_comment
                FROM machine_report_responses
                WHERE machine_reports.machine_report_id = machine_report_id
                ORDER BY commented_at ASC
            );
        `);

        await queryRunner.query(`
            UPDATE mh
            SET
                mh.first_report_comment = mr.first_report_comment
            FROM
                machine_report_histories mh
            INNER JOIN
                machine_reports mr ON mh.machine_report_id = mr.machine_report_id;        
        `);

        await queryRunner.query(
            'ALTER TABLE machine_reports ALTER COLUMN first_report_comment NVARCHAR(MAX) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_histories ALTER COLUMN first_report_comment NVARCHAR(MAX) NOT NULL;',
        );
    }
}
