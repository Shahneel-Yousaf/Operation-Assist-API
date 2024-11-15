import { MigrationInterface, QueryRunner } from 'typeorm';

export class MachineReportResponseTable1705371306226
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN machine_report_id CHAR(26) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses ALTER COLUMN machine_report_id CHAR(26) NULL;',
        );
    }
}
