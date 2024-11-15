import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGroupMachineAssignmentHistoriesTable1700474684030
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //group_machine_assignment_histories
        await queryRunner.query(
            'ALTER TABLE group_machine_assignment_histories DROP CONSTRAINT  CHK_39210fb3b5299c1d54f37efb32_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE group_machine_assignment_histories ADD CONSTRAINT CHK_39210fb3b5299c1d54f37efb32_ENUM CHECK(event_type IN ('ASSIGNED', 'UNASSIGNED'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //group_machine_assignment_histories
        await queryRunner.query(
            'ALTER TABLE group_machine_assignment_histories DROP CONSTRAINT  CHK_39210fb3b5299c1d54f37efb32_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE group_machine_assignment_histories ADD CONSTRAINT CHK_39210fb3b5299c1d54f37efb32_ENUM CHECK(event_type IN ('GROUP_MACHINE_ASSIGNMENT_START', 'GROUP_MACHINE_ASSIGNMENT_END'));`,
        );
    }
}
