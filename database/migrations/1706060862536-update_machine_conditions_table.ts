import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMachineConditionsTable1706060862536
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE INDEX machine_conditions_machine_condition_idx ON machine_conditions (machine_condition);',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DROP INDEX machine_conditions_machine_condition_idx ON machine_conditions;',
        );
    }
}
