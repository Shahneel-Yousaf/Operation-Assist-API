import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReportResponsesTable1718614932462
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN status VARCHAR(128) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE fuel_maintenance_reports ALTER COLUMN service_meter_in_hour DECIMAL(8,1) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN report_comment NVARCHAR(MAX) NULL;',
        );

        await queryRunner.query(
            `UPDATE machine_report_responses SET report_comment = NULL WHERE datalength(report_comment) = 0`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE machine_report_responses SET status = 'UNADDRESSED' WHERE status IS NULL`,
        );

        await queryRunner.query(
            `DROP INDEX "IDX_eb9606aec521e8a2a60e667443" ON "machine_report_responses"`,
        );

        await queryRunner.query(
            `DROP INDEX "nci_msft_1_machine_report_responses_7FAF916EF2C1BB90885B38239191387E" ON "machine_report_responses"`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN status VARCHAR(128) NOT NULL;',
        );

        await queryRunner.query(
            `CREATE INDEX "IDX_eb9606aec521e8a2a60e667443" ON "machine_report_responses" ("status")`,
        );

        await queryRunner.query(`
            CREATE NONCLUSTERED INDEX [nci_msft_1_machine_report_responses_7FAF916EF2C1BB90885B38239191387E] 
            ON [dbo].[machine_report_responses] ([status])
            INCLUDE (
                [machine_report_id]
            )
            WITH (
                ONLINE = ON
            );
        `);

        await queryRunner.query(
            `UPDATE fuel_maintenance_reports SET service_meter_in_hour = 0.0 WHERE service_meter_in_hour IS NULL`,
        );

        await queryRunner.query(
            'ALTER TABLE fuel_maintenance_reports ALTER COLUMN service_meter_in_hour DECIMAL(8,1) NOT NULL;',
        );

        await queryRunner.query(
            `UPDATE machine_report_responses SET report_comment = '' WHERE report_comment IS NULL`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN report_comment NVARCHAR(MAX) NOT NULL;',
        );
    }
}
