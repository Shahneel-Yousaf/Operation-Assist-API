import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateContentCodeNotificationsTable1720670007865
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE notifications DROP CONSTRAINT CHK_b0dcd4709d297052c2a08f34e4_ENUM;',
        );

        await queryRunner.query(
            `UPDATE notifications SET content_code = 'INCIDENT_REPORT_POSTED' WHERE content_code = 'MACHINE_REPORT_POSTED';`,
        );

        await queryRunner.query(
            `UPDATE notifications SET content_code = 'INCIDENT_REPORT_UPDATED_AND_UNADDRESSED' WHERE content_code = 'MACHINE_REPORT_UPDATED_AND_UNADDRESSED';`,
        );

        await queryRunner.query(
            `UPDATE notifications SET content_code = 'INCIDENT_REPORT_UPDATED_AND_RESOLVED' WHERE content_code = 'MACHINE_REPORT_UPDATED_AND_RESOLVED';`,
        );

        await queryRunner.query(
            `ALTER TABLE notifications
                ADD CONSTRAINT CHK_b0dcd4709d297052c2a08f34e4_ENUM CHECK (content_code IN('INSPECTION_POSTED',
                'INCIDENT_REPORT_POSTED',
                'INCIDENT_REPORT_UPDATED_AND_UNADDRESSED',
                'INCIDENT_REPORT_UPDATED_AND_RESOLVED',
                'MAINTENANCE_REPORT_POSTED',
                'MACHINE_OPERATION_REPORT_POSTED',
                'FUEL_MAINTENANCE_REPORT_POSTED'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE notifications DROP CONSTRAINT CHK_b0dcd4709d297052c2a08f34e4_ENUM;',
        );

        await queryRunner.query(
            `UPDATE notifications SET content_code = 'MACHINE_REPORT_POSTED' WHERE content_code = 'INCIDENT_REPORT_POSTED';`,
        );

        await queryRunner.query(
            `UPDATE notifications SET content_code = 'MACHINE_REPORT_UPDATED_AND_UNADDRESSED' WHERE content_code = 'INCIDENT_REPORT_UPDATED_AND_UNADDRESSED';`,
        );

        await queryRunner.query(
            `UPDATE notifications SET content_code = 'MACHINE_REPORT_UPDATED_AND_RESOLVED' WHERE content_code = 'INCIDENT_REPORT_UPDATED_AND_RESOLVED';`,
        );

        await queryRunner.query(
            `ALTER TABLE notifications
                ADD CONSTRAINT CHK_b0dcd4709d297052c2a08f34e4_ENUM CHECK (content_code IN( 'INSPECTION_POSTED',
                'MACHINE_REPORT_POSTED',
                'MACHINE_REPORT_UPDATED_AND_UNADDRESSED',
                'MACHINE_REPORT_UPDATED_AND_RESOLVED'));`,
        );
    }
}
