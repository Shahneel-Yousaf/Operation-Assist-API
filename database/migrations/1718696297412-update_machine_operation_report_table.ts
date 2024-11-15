import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMachineOperationReportTable1718696297412
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `EXEC sp_rename '[machine_operation_reports].[comment	]', 'comment', 'COLUMN';`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `EXEC sp_rename '[machine_operation_reports].[comment]', 'comment	', 'COLUMN';`,
        );
    }
}
