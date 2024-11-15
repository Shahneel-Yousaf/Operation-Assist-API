import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    operationTemplateData,
    permissionTemplateData,
    permissionTranslateTemplateData,
    resourceTemplateData,
    userGroupRoleTemplatePermissionAssignmentTemplateData,
} from '../template-data';

export class UpdatePermissionTemplateForUpdateGroup1702894892929
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await resourceTemplateData(queryRunner);
        await operationTemplateData(queryRunner);
        await permissionTemplateData(queryRunner);
        await permissionTranslateTemplateData(queryRunner);
        await userGroupRoleTemplatePermissionAssignmentTemplateData(
            queryRunner,
        );
        await queryRunner.query(`
            INSERT INTO user_group_permission_assignments (user_id, group_id, permission_id, assigned_at)
            SELECT
                user_id,
                group_id,
                '065BDR92ZSK8KXMJZBQKKS9YFX' permission_id,
                CURRENT_TIMESTAMP assigned_at
            FROM
                user_group_assignments;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM resources');
        await queryRunner.query('DELETE FROM operations');
        await queryRunner.query('DELETE FROM permissions');
        await queryRunner.query('DELETE FROM permission_translations');
        await queryRunner.query(
            'DELETE FROM user_group_role_template_permission_assignments',
        );
        await queryRunner.clearTable('user_group_permission_assignments');
    }
}
