import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class UpdateCustomInspectionItemTable1705311141280
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "IDX_691154db8cc7edcf901d428141" ON "custom_inspection_items"`,
        );

        await queryRunner.query(
            'ALTER TABLE custom_inspection_items ALTER COLUMN custom_inspection_form_id CHAR(26) NOT NULL;',
        );

        await queryRunner.createIndex(
            'custom_inspection_items',
            new TableIndex({
                columnNames: ['position', 'custom_inspection_form_id'],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE custom_inspection_items ALTER COLUMN custom_inspection_form_id CHAR(26) NULL;',
        );
    }
}
