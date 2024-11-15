import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class UpdateTableCustomInspectionItems1704444289968
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE custom_inspection_item_histories DROP CONSTRAINT UQ_b13ba3ad0ccaf72d5f3ec0d671f;
        `);

        queryRunner.query(`
            ALTER TABLE custom_inspection_items DROP CONSTRAINT UQ_8d8219ed936dc02d612305577ca;
        `);

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
            `ALTER TABLE custom_inspection_item_histories ADD CONSTRAINT UQ_b13ba3ad0ccaf72d5f3ec0d671f UNIQUE (position);`,
        );

        await queryRunner.query(
            `ALTER TABLE custom_inspection_items ADD CONSTRAINT UQ_8d8219ed936dc02d612305577ca UNIQUE (position);`,
        );

        await queryRunner.dropIndex(
            'custom_inspection_items',
            'IDX_691154db8cc7edcf901d428141',
        );
    }
}
