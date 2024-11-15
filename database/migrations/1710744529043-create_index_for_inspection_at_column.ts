import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexForInspectionAtColumn1710744529043
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'inspections',
            new TableIndex({ columnNames: ['inspection_at'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex(
            'inspections',
            'IDX_15a07a66faaa934a9ec3760101',
        );
    }
}
