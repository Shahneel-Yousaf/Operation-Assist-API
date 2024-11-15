import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateMachineTable1719386768522 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // machines
        await queryRunner.addColumn(
            'machines',
            new TableColumn({
                name: 'last_service_meter_updated_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // machines
        await queryRunner.dropColumn(
            'machines',
            'last_service_meter_updated_at',
        );
    }
}
