import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCustomInspectionItemHistoriesTable1711682260894
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_histories ALTER COLUMN name NVARCHAR(256) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_histories ALTER COLUMN description NVARCHAR(256) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_histories ALTER COLUMN name NVARCHAR(128) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_histories ALTER COLUMN description NVARCHAR(128) NOT NULL;',
        );
    }
}
