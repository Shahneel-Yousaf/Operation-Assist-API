import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateMachineReportsTable1702624240198
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'machine_reports',
            new TableColumn({
                name: 'first_report_comment',
                type: 'NVARCHAR',
                length: 'MAX',
                isNullable: true,
            }),
        );

        await queryRunner.query(
            `UPDATE machine_reports SET first_report_comment = '' WHERE first_report_comment IS NULL;`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_reports ALTER COLUMN first_report_comment NVARCHAR(MAX) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_reports DROP CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'UNADDRESSED' WHERE current_status = 'OPEN';`,
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'RESOLVED' WHERE current_status = 'CLOSED';`,
        );
        await queryRunner.query(
            `ALTER TABLE machine_reports ADD CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM CHECK(current_status IN ('DRAFT', 'UNADDRESSED', 'RESOLVED'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('machine_reports', 'first_report_comment');

        await queryRunner.query(
            'ALTER TABLE machine_reports DROP CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'OPEN' WHERE current_status = 'UNADDRESSED';`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_reports ADD CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM CHECK(current_status IN ('DRAFT', 'OPEN', 'CLOSED', 'RESOLVED'));`,
        );
    }
}
