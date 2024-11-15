import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEnumCurrentStatusMachinesAndMachineHistories1701677849927
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE machine_histories
            SET current_status = 'CREATED'
            WHERE current_status IN ('ARCHIVED', 'UNARCHIVED');
        `);

        await queryRunner.query(`
            UPDATE machines
            SET current_status = 'CREATED'
            WHERE current_status = 'ARCHIVED';
        `);

        await queryRunner.query(
            'ALTER TABLE machines DROP CONSTRAINT CHK_07003e3b0e80f35020f8367b94_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machines ADD CONSTRAINT CHK_07003e3b0e80f35020f8367b94_ENUM CHECK(current_status IN ('CREATED', 'UPDATED', 'DELETED'));`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_histories DROP CONSTRAINT CHK_00b072fa6928f33a03767ce4ac_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machine_histories ADD CONSTRAINT CHK_00b072fa6928f33a03767ce4ac_ENUM CHECK(current_status IN ('CREATED', 'UPDATED', 'DELETED'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE machines DROP CONSTRAINT CHK_07003e3b0e80f35020f8367b94_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machines ADD CONSTRAINT CHK_07003e3b0e80f35020f8367b94_ENUM CHECK(current_status IN ('CREATED', 'UPDATED', 'DELETED', 'ARCHIVED'));`,
        );

        await queryRunner.query(
            'ALTER TABLE machine_histories DROP CONSTRAINT CHK_00b072fa6928f33a03767ce4ac_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE machine_histories ADD CONSTRAINT CHK_00b072fa6928f33a03767ce4ac_ENUM CHECK(current_status IN ('CREATED', 'UPDATED', 'DELETED', 'ARCHIVED', 'UNARCHIVED'));`,
        );
    }
}
