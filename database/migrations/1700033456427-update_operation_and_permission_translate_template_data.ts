import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    operationTemplateData,
    permissionTranslateTemplateData,
} from '../template-data';

export class UpdateOperationAndPermissionTranslateTemplateData1700033456427
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await operationTemplateData(queryRunner);
        await permissionTranslateTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable('operations');
        await queryRunner.clearTable('permission_translations');
    }
}
