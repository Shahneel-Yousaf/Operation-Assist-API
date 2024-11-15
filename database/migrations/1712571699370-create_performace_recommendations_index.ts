import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePerformaceRecommendationsIndex1712571699370
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
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

        await queryRunner.query(`
            CREATE NONCLUSTERED INDEX [nci_msft_1_inspection_histories_E28D51F57BC1CC2E9B5C3777BFECCAA7] 
            ON [dbo].[inspection_histories] ([inspection_id], [event_type])
            INCLUDE (
                [actioned_by_user_id],
                [current_status],
                [custom_inspection_form_id],
                [device_platform],
                [event_at],
                [inspection_at],
                [lat],
                [lng],
                [location_accuracy],
                [machine_id]
            )
            WITH (
                ONLINE = ON
            );
        `);

        await queryRunner.query(`
            CREATE NONCLUSTERED INDEX [nci_msft_1_inspection_results_28585EB5BDEE15259D0E30BE2E22412B] 
            ON [dbo].[inspection_results] ([result], [inspection_id])
            WITH (
                ONLINE = ON
            );
        `);

        await queryRunner.query(`
            CREATE NONCLUSTERED INDEX [nci_msft_1_inspections_F040A25F35AB228F69B4300D517B59A0] 
            ON [dbo].[inspections] ([current_status])
            INCLUDE (
                [custom_inspection_form_id],
                [last_status_updated_at],
                [machine_id]
            )
            WITH (
                ONLINE = ON
            );   
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex(
            'machine_report_responses',
            'nci_msft_1_machine_report_responses_7FAF916EF2C1BB90885B38239191387E',
        );

        await queryRunner.dropIndex(
            'inspection_histories',
            'nci_msft_1_inspection_histories_E28D51F57BC1CC2E9B5C3777BFECCAA7',
        );

        await queryRunner.dropIndex(
            'inspection_results',
            'nci_msft_1_inspection_results_28585EB5BDEE15259D0E30BE2E22412B',
        );

        await queryRunner.dropIndex(
            'inspections',
            'nci_msft_1_inspections_F040A25F35AB228F69B4300D517B59A0',
        );
    }
}
