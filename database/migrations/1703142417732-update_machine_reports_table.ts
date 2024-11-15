import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMachineReportsTable1703142417732
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_reports DROP CONSTRAINT DF_8c87613d83ff0a8c65b62ce72ac;',
        );

        await queryRunner.query(
            'ALTER TABLE machine_reports DROP CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'POSTED' WHERE current_status = 'RESOLVED';`,
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'UPDATED' WHERE current_status = 'UNADDRESSED';`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_reports ADD CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM CHECK(current_status IN ('POSTED', 'UPDATED', 'DRAFT'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_reports DROP CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'RESOLVED' WHERE current_status = 'POSTED';`,
        );

        await queryRunner.query(
            `UPDATE machine_reports SET current_status = 'UNADDRESSED' WHERE current_status = 'UPDATED';`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_reports ADD CONSTRAINT CHK_a4d5c8a84f30961839b53974a9_ENUM CHECK(current_status IN ('RESOLVED', 'UNADDRESSED', 'DRAFT'));`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_reports ADD CONSTRAINT DF_8c87613d83ff0a8c65b62ce72ac DEFAULT 'OPEN' FOR current_status;`,
        );
    }
}
