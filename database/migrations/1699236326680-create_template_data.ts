import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    operationTemplateData,
    permissionTemplateData,
    permissionTranslateTemplateData,
    resourceTemplateData,
    userGroupRoleNameTranslationTemplateData,
    userGroupRoleTemplatePermissionAssignmentTemplateData,
    userGroupRoleTemplateTemplateData,
} from '../template-data';

export class CreateTemplateData1699236326680 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await userGroupRoleTemplateTemplateData(queryRunner);
        await resourceTemplateData(queryRunner);
        await operationTemplateData(queryRunner);
        await permissionTemplateData(queryRunner);
        await permissionTranslateTemplateData(queryRunner);
        await userGroupRoleNameTranslationTemplateData(queryRunner);
        await userGroupRoleTemplatePermissionAssignmentTemplateData(
            queryRunner,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('user_group_role_templates');
        await queryRunner.clearTable('resources');
        await queryRunner.clearTable('operations');
        await queryRunner.clearTable('permissions');
        await queryRunner.clearTable('permission_translations');
        await queryRunner.clearTable('user_group_role_name_translations');
        await queryRunner.clearTable(
            'user_group_role_template_permission_assignments',
        );
    }
}
