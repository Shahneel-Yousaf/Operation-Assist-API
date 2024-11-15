import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDevicePlatform1709803183964 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_0d349f73f5a249ec34cf0d33ec_ENUM;',
        );

        await queryRunner.query(
            'ALTER TABLE inspections DROP CONSTRAINT CHK_0f7d55dfa7305e6e9bde514eef_ENUM;',
        );

        await queryRunner.query(
            'ALTER TABLE devices DROP CONSTRAINT  CHK_52874d92a072048d31208d4b5c_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses
                ADD CONSTRAINT CHK_0d349f73f5a249ec34cf0d33ec_ENUM CHECK (device_platform IN('ANDROID', 'IOS', 'WEB'));`,
        );

        await queryRunner.query(
            `ALTER TABLE inspections
                ADD CONSTRAINT CHK_0f7d55dfa7305e6e9bde514eef_ENUM CHECK (device_platform IN('ANDROID', 'IOS', 'WEB'));`,
        );

        await queryRunner.query(
            `ALTER TABLE devices
                ADD CONSTRAINT CHK_52874d92a072048d31208d4b5c_ENUM CHECK (device_type IN('ANDROID', 'IOS', 'WEB'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machine_report_responses DROP CONSTRAINT CHK_0d349f73f5a249ec34cf0d33ec_ENUM;',
        );

        await queryRunner.query(
            'ALTER TABLE inspections DROP CONSTRAINT CHK_0f7d55dfa7305e6e9bde514eef_ENUM;',
        );

        await queryRunner.query(
            'ALTER TABLE devices DROP CONSTRAINT  CHK_52874d92a072048d31208d4b5c_ENUM;',
        );

        await queryRunner.query(
            `UPDATE machine_report_responses SET device_platform = 'IOS' WHERE device_platform = 'WEB';`,
        );

        await queryRunner.query(
            `UPDATE inspections SET device_platform = 'IOS' WHERE device_platform = 'WEB';`,
        );

        await queryRunner.query(
            `UPDATE devices SET device_type = 'IOS' WHERE device_type = 'WEB';`,
        );

        await queryRunner.query(
            `ALTER TABLE machine_report_responses
                ADD CONSTRAINT CHK_0d349f73f5a249ec34cf0d33ec_ENUM CHECK (device_platform IN('ANDROID', 'IOS'));`,
        );

        await queryRunner.query(
            `ALTER TABLE inspections
                ADD CONSTRAINT CHK_0f7d55dfa7305e6e9bde514eef_ENUM CHECK (device_platform IN('ANDROID', 'IOS'));`,
        );

        await queryRunner.query(
            `ALTER TABLE devices
                ADD CONSTRAINT CHK_52874d92a072048d31208d4b5c_ENUM CHECK (device_type IN('ANDROID', 'IOS'));`,
        );
    }
}
