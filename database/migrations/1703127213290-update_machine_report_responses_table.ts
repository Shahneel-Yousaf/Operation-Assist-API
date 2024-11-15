import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMachineReportResponsesTable1703127213290
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT DF_eb9606aec521e8a2a60e6674435;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_205f13ef83a2cc91aae9ef538c_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_report_responses SET status = 'UNADDRESSED' WHERE status = 'OPEN' OR status = 'CLOSED';`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses ADD CONSTRAINT CHK_205f13ef83a2cc91aae9ef538c_ENUM CHECK(status IN ('UNADDRESSED', 'RESOLVED'));`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN machine_report_id CHAR(26) NULL;',
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_205f13ef83a2cc91aae9ef538c_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_report_responses SET status = 'OPEN' WHERE status = 'UNADDRESSED';`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses ADD CONSTRAINT CHK_205f13ef83a2cc91aae9ef538c_ENUM CHECK(status IN ('OPEN', 'RESOLVED', 'CLOSE'));`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses ADD CONSTRAINT DF_eb9606aec521e8a2a60e6674435 DEFAULT 'OPEN' FOR status;`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN machine_report_id CHAR(26) NOT NULL;',
        );
    }
}
