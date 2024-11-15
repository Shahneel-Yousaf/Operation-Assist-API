import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFileNameSizeInspectionMachineReport1714029427432
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_medias ALTER COLUMN file_name NVARCHAR(255) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE machine_report_medias ALTER COLUMN file_name NVARCHAR(255) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_medias ALTER COLUMN file_name NVARCHAR(128) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE machine_report_medias ALTER COLUMN file_name NVARCHAR(128) NOT NULL;',
        );
    }
}
