import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateTableMachines1702541517757 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update table machines
        await queryRunner.query(`
            EXEC sp_RENAME 'machines.machine_name', 'customer_machine_name', 'COLUMN';
        `);
        await queryRunner.addColumns('machines', [
            new TableColumn({
                name: 'custom_machine_manufacturer_name',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'custom_type_name',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
        ]);

        // Update table machine_histories
        await queryRunner.query(`
            EXEC sp_RENAME 'machine_histories.machine_name', 'customer_machine_name', 'COLUMN';
        `);
        await queryRunner.addColumns('machine_histories', [
            new TableColumn({
                name: 'custom_machine_manufacturer_name',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'custom_type_name',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            EXEC sp_RENAME 'machines.customer_machine_name', 'machine_name', 'COLUMN';
        `);

        await queryRunner.dropColumns('machines', [
            'custom_machine_manufacturer_name',
            'custom_type_name',
        ]);

        await queryRunner.query(`
            EXEC sp_RENAME 'machine_histories.customer_machine_name', 'machine_name', 'COLUMN';
        `);

        await queryRunner.dropColumns('machine_histories', [
            'custom_machine_manufacturer_name',
            'custom_type_name',
        ]);
    }
}
