import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNullableInGroupTables1698812279254
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //groups
        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN location NVARCHAR(255) NULL;',
        );

        //group_histories
        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN group_name NVARCHAR(255) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //groups
        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN location NVARCHAR(255) NOT NULL;',
        );

        //group_histories
        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN group_name NVARCHAR(255) NULL;',
        );
    }
}
