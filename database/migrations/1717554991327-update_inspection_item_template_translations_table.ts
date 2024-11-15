import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInspectionItemTemplateTranslationsTable1717554991327
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_name NVARCHAR(100) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_description NVARCHAR(150) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_name NVARCHAR(256) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations ALTER COLUMN item_description NVARCHAR(256) NOT NULL;',
        );
    }
}
