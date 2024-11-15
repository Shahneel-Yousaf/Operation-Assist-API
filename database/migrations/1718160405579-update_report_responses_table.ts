import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateReportResponsesTable1718160405579
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('machine_report_responses', [
            new TableColumn({
                name: 'subtype',
                type: 'VARCHAR',
                length: '64',
                isNullable: true,
                enum: [
                    'MACHINE_OPERATION_REPORTS',
                    'FUEL_MAINTENANCE_REPORTS',
                    'INSPECTION_NORMAL_COMMENTS',
                    'INCIDENT_REPORTS',
                    'STATUS_UPDATES',
                ],
            }),
            new TableColumn({
                name: 'service_meter_in_hour',
                type: 'DECIMAL(8,1)',
                isNullable: true,
            }),
        ]);

        await queryRunner.query(
            `EXEC sp_rename '[machine_report_responses].[commented_at]', 'responsed_at', 'COLUMN';`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_d314b6582da026aa9253994565_ENUM;',
        );

        await queryRunner.dropColumns('machine_report_responses', [
            'subtype',
            'service_meter_in_hour',
        ]);

        await queryRunner.query(
            `EXEC sp_rename '[machine_report_responses].[responsed_at]', 'commented_at', 'COLUMN';`,
        );
    }
}
