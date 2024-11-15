import { MigrationInterface, QueryRunner } from 'typeorm';

import { updateUserGroupRoleNameTranslationTemplateData } from '../template-data';

export class UpdateUserGroupRoleNameTranslationsTable1712546326677
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM user_group_role_name_translations',
        );
        await updateUserGroupRoleNameTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DELETE FROM user_group_role_name_translations',
        );
    }
    n;
}
