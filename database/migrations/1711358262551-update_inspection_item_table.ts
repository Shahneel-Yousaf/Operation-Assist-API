import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInspectionItemTable1711358262551
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_name NVARCHAR(256) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_description NVARCHAR(256) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE custom_inspection_items ALTER COLUMN name NVARCHAR(256) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE custom_inspection_items ALTER COLUMN description NVARCHAR(256) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_name NVARCHAR(128) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_description NVARCHAR(128) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE custom_inspection_items ALTER COLUMN name NVARCHAR(128) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE custom_inspection_items ALTER COLUMN description NVARCHAR(128) NOT NULL;',
        );
    }
}
