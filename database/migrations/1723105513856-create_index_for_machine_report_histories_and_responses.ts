import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexForMachineReportHistoriesAndResponses1723105513856
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE NONCLUSTERED INDEX [nci_msft_1_machine_report_histories_A4D0C939613289E9B8BD0A647BB4990F] ON [dbo].[machine_report_histories] (
                [machine_id],
                [event_type])
            INCLUDE (
                [actioned_by_user_id],
                [machine_report_id]
            )
            WITH (
                ONLINE = ON
            );
        `);

        await queryRunner.query(`
            CREATE NONCLUSTERED INDEX [nci_msft_1_machine_reports_42ECB98C8EFE3718545DD1E5387C4279] ON [dbo].[machine_reports] (
                [first_machine_report_response_id],
                [machine_id],
                [current_status])
            INCLUDE (
                [last_status_updated_at]
            )
            WITH (
                ONLINE = ON
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
