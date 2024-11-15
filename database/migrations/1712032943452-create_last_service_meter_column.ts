import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class CreateLastServiceMeterColumn1712032943452
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'machines',
            new TableColumn({
                name: 'last_service_meter',
                type: 'NVARCHAR',
                length: '128',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('machines', 'last_service_meter');
    }
}
