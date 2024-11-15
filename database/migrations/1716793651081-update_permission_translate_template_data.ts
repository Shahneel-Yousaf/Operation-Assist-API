import { MigrationInterface, QueryRunner } from 'typeorm';

import { updatePermissionTranslateTemplateData } from '../template-data';

export class UpdatePermissionTranslateTemplateData1716793651081
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await updatePermissionTranslateTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM permission_translations');
    }
}
