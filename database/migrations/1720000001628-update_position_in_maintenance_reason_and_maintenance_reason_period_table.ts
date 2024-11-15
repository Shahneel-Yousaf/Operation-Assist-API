import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdatePositionInMaintenanceReasonAndMaintenanceReasonPeriodTable1720000001628
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // maintenance_reason_choices
        await queryRunner.addColumn(
            'maintenance_reason_choices',
            new TableColumn({
                name: 'position',
                type: 'INT',
            }),
        );
        // maintenance_reason_period_choices
        await queryRunner.addColumn(
            'maintenance_reason_period_choices',
            new TableColumn({
                name: 'position',
                type: 'INT',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // maintenance_reason_choices
        await queryRunner.dropColumn('maintenance_reason_choices', 'position');
        // maintenance_reason_period_choices
        await queryRunner.dropColumn(
            'maintenance_reason_period_choices',
            'position',
        );
    }
}
