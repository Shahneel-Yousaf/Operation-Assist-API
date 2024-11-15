import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexForMachineReportReportResponse1722411955022
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE NONCLUSTERED INDEX [nci_msft_1_machine_reports_DA29FCB45AB22AD4D57E1CC5F5274E05] ON [dbo].[machine_reports] (
            [machine_id],
            [current_status])
        INCLUDE (
            [first_machine_report_response_id],
            [inspection_result_id],
            [last_machine_report_response_id],
            [last_status_updated_at],
            [report_title]
        )
        WITH (
            ONLINE = ON)`);

        await queryRunner.query(`
        CREATE NONCLUSTERED INDEX [nci_msft_1_machine_report_responses_B449206A959B34593E19D59F6F7127A5] ON [dbo].[machine_report_responses] (
            [machine_report_id])
        INCLUDE (
            [device_platform],
            [lat],
            [lng],
            [location_accuracy],
            [report_comment],
            [responsed_at],
            [service_meter_in_hour],
            [status],
            [subtype],
            [user_id]
        )
        WITH (
            ONLINE = ON)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex(
            'machine_reports',
            'nci_msft_1_machine_reports_DA29FCB45AB22AD4D57E1CC5F5274E05',
        );

        await queryRunner.dropIndex(
            'machine_report_responses',
            'nci_msft_1_machine_report_responses_B449206A959B34593E19D59F6F7127A5',
        );
    }
}
