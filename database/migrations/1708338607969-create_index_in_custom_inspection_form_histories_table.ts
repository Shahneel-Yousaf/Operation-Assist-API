import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexInCustomInspectionFormHistoriesTable1708338607969
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'custom_inspection_forms',
            new TableIndex({ columnNames: ['current_status'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "IDX_6f7e0e9c51ad79beedcdba8d62" ON "custom_inspection_forms"`,
        );
    }
}
