import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserGroupAssignmentHistoryTable1700466824155
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //user_group_assignment_histories
        await queryRunner.query(
            'ALTER TABLE user_group_assignment_histories DROP CONSTRAINT  CHK_410575b705e3b1149405141dc9_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE user_group_assignment_histories ADD CONSTRAINT CHK_410575b705e3b1149405141dc9_ENUM CHECK(event_type IN ('ASSIGNED', 'UNASSIGNED'));`,
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignment_histories DROP CONSTRAINT  CHK_491b0e3ed4b3d589085fa3fd8d_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE user_group_assignment_histories ADD CONSTRAINT CHK_413d4rb705e3b11494051f5a52_ENUM CHECK(current_status IN ('ASSIGNED', 'UNASSIGNED'));`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //user_group_assignment_histories
        await queryRunner.query(
            'ALTER TABLE user_group_assignment_histories DROP CONSTRAINT  CHK_410575b705e3b1149405141dc9_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE user_group_assignment_histories ADD CONSTRAINT CHK_410575b705e3b1149405141dc9_ENUM CHECK(event_type IN ('USER_GROUP_ASSIGNMENT_START', 'USER_GROUP_ASSIGNMENT_END'));`,
        );

        await queryRunner.query(
            `ALTER TABLE user_group_assignment_histories ADD CONSTRAINT CHK_491b0e3ed4b3d589085fa3fd8d_ENUM CHECK(event_type IN ('ASSIGNED', 'UNASSIGNED'));`,
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignment_histories DROP CONSTRAINT  CHK_413d4rb705e3b11494051f5a52_ENUM;',
        );
    }
}
