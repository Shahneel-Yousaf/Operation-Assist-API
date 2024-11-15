import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateServiceMeterInHour1719473902897
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE
            machine_report_responses
        SET
            service_meter_in_hour = "mrr"."result"
        FROM
            machine_report_responses
            INNER JOIN (
                SELECT
                    i.inspection_id,
                    ir.inspection_result_id,
                    ir2.item_code,
                    ir2.result,
                    mr.first_machine_report_response_id
                FROM
                    inspections i
                    INNER JOIN inspection_results ir ON i.inspection_id = ir.inspection_id
                    INNER JOIN machine_reports mr ON ir.inspection_result_id = mr.inspection_result_id
                    INNER JOIN inspection_results ir2 ON ir2.inspection_id = i.inspection_id
                        AND ir2.item_code = 'SERVICE_METER'
                        AND ir2.result <> ''
            ) "mrr" ON machine_report_responses.machine_report_response_id = "mrr".first_machine_report_response_id;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
