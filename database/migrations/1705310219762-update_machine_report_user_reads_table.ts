import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMachineReportUserReadsTable1705310219762
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE [dbo].[machine_report_user_reads] ADD CONSTRAINT DF__machine_r__read___19176912 DEFAULT GETDATE() FOR [read_at];',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_user_reads DROP CONSTRAINT DF__machine_r__read___19176912;',
        );
    }
}
