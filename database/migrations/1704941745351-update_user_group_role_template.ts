import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserGroupRoleTemplate1704941745351
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('group_invitations', [
            new TableColumn({
                name: 'user_group_role_template_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        ]);

        await queryRunner.addColumns('user_group_assignments', [
            new TableColumn({
                name: 'user_group_role_template_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        ]);

        await queryRunner.query(`
            UPDATE group_invitations
            SET user_group_role_template_id = '065D0EV3Q686CMBSQCDKR1FACC'
        `);

        await queryRunner.query(`
            UPDATE user_group_assignments
            SET user_group_role_template_id = '065D0EV3Q686CMBSQCDKR1FACC'
        `);

        await queryRunner.query(
            'ALTER TABLE group_invitations ALTER COLUMN user_group_role_template_id CHAR(26) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignments ALTER COLUMN user_group_role_template_id CHAR(26) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('group_invitations', [
            'user_group_role_template_id',
        ]);

        await queryRunner.dropColumns('user_group_assignments', [
            'user_group_role_template_id',
        ]);
    }
}
