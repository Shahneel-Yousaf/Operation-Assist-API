import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDataTableMachineConditions1702348829102
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO machine_conditions (machine_id, user_id, machine_condition)
            SELECT
                machine_histories.machine_id,
                machine_histories.actioned_by_user_id,
                'NORMAL'
            FROM
                machine_histories;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_conditions');
    }
}
