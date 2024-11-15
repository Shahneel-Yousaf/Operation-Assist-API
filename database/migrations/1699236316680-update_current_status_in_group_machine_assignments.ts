import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCurrentStatusInGroupMachineAssignments1699236316680
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //group_machine_assignments
        await queryRunner.query(
            `ALTER TABLE group_machine_assignments ADD CONSTRAINT CHK_e04f1101bb04ceaa9fa38c5fd5_ENUM CHECK(current_status IN ('ASSIGNED', 'UNASSIGNED'));`,
        );

        //group_machine_assignment_histories
        await queryRunner.query(
            `ALTER TABLE group_machine_assignment_histories ADD CONSTRAINT CHK_e04f1101bb04ceaa9fa38c4fd4_ENUM CHECK(current_status IN ('ASSIGNED', 'UNASSIGNED'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //group_machine_assignments
        await queryRunner.query(
            'ALTER TABLE group_machine_assignments DROP CONSTRAINT  CHK_e04f1101bb04ceaa9fa38c5fd5_ENUM;',
        );

        //group_machine_assignment_histories
        await queryRunner.query(
            'ALTER TABLE group_machine_assignment_histories DROP CONSTRAINT  CHK_e04f1101bb04ceaa9fa38c4fd4_ENUM;',
        );
    }
}
