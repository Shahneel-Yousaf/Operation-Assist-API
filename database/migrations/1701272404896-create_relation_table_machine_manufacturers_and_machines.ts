import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationTableMachineManufacturersAndMachines1701272404896
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE machines
        ADD CONSTRAINT FK_5437449420a7461aa0ae46d5260
        FOREIGN KEY (machine_manufacturer_id)
        REFERENCES machine_manufacturers(machine_manufacturer_id);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        ALTER TABLE machines
        DROP CONSTRAINT IF EXISTS FK_5437449420a7461aa0ae46d5260;
    `);
    }
}
