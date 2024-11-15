import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class UpdateSubtypeInReportResponsesTable1719914325618
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_d314b6582da026aa9253994565_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses ADD CONSTRAINT CHK_d314b6582da026aa9253994565_ENUM 
            CHECK(subtype IN ('MACHINE_OPERATION_REPORTS', 'FUEL_MAINTENANCE_REPORTS', 'INSPECTION_NORMAL_COMMENTS',
            'INCIDENT_REPORTS', 'STATUS_UPDATES', 'MAINTENANCE_REPORTS'));`,
        );

        await queryRunner.createIndex(
            'machine_report_responses',
            new TableIndex({ columnNames: ['subtype'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_d314b6582da026aa9253994565_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses ADD CONSTRAINT CHK_d314b6582da026aa9253994565_ENUM 
            CHECK(subtype IN ('MACHINE_OPERATION_REPORTS', 'FUEL_MAINTENANCE_REPORTS', 'INSPECTION_NORMAL_COMMENTS',
            'INCIDENT_REPORTS', 'STATUS_UPDATES'));`,
        );

        await queryRunner.dropIndex(
            'machine_report_responses',
            'IDX_7cd524f4e18c90ac4c2fb3c38b',
        );
    }
}
