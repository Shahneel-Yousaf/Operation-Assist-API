import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateReportResponseData1718183074121
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE machine_report_responses
            SET machine_report_responses.subtype = 'INCIDENT_REPORTS'
            FROM machine_report_responses
                INNER JOIN machine_reports
                ON machine_report_responses.machine_report_response_id = machine_reports.first_machine_report_response_id;
        `);

        await queryRunner.query(`
            UPDATE machine_report_responses
            SET machine_report_responses.subtype = 'STATUS_UPDATES'
            WHERE machine_report_responses.subtype IS NULL
        `);

        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN subtype VARCHAR(64) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN subtype VARCHAR(64) NULL;',
        );

        await queryRunner.query(`
            UPDATE machine_report_responses
            SET machine_report_responses.subtype = NULL;
        `);
    }
}
