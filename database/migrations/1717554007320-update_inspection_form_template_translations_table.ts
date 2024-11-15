import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateInspectionFormTemplateTranslationsTable1717554007320
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE inspection_form_template_translations ALTER COLUMN inspection_form_template_name NVARCHAR(50) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE inspection_form_template_translations ALTER COLUMN inspection_form_template_name NVARCHAR(128) NOT NULL;',
        );
    }
}
