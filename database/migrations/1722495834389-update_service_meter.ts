import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateServiceMeter1722495834389 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        UPDATE
            machines
        SET
            machines.last_service_meter = "serviceMeter"."serviceMeter"
        FROM
            machines "machines"
            INNER JOIN (
                SELECT
                    "machines"."machine_id" "machineId",
                    inspection.serviceMeter "serviceMeter",
                    CONVERT(datetime, inspection.updatedAt) "updatedAt"
                FROM
                    "machines" "machines"
                    LEFT JOIN (
                        SELECT
                        "inspection"."machine_id" "machineId",
                        "inspectionResults"."result" "serviceMeter",
                        "inspectionResults"."last_status_updated_at" "updatedAt",
                        "inspection"."current_status" "currentStatus",
                        ROW_NUMBER() OVER (PARTITION BY "inspection"."machine_id" ORDER BY "inspectionResults"."last_status_updated_at" DESC) AS rowNum
                    FROM
                        "inspections" "inspection"
                        INNER JOIN "inspection_results" "inspectionResults" ON "inspectionResults"."inspection_id" = "inspection"."inspection_id"
                            AND("inspectionResults"."item_code" = 'SERVICE_METER'
                            AND "inspection"."current_status" = 'POSTED')) "inspection" ON "machines"."machine_id" = inspection.machineId
                    WHERE
                        inspection.rowNum = 1) "serviceMeter" ON ("serviceMeter"."machineId" = "machines"."machine_id"
                        AND "serviceMeter".updatedAt >= machines.last_service_meter_updated_at);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
