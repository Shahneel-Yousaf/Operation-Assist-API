import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexForCustomerMachineNameColumn1711941467303
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['customer_machine_name'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex(
            'machines',
            'IDX_f5276660034c28070bbd74f316',
        );
    }
}
