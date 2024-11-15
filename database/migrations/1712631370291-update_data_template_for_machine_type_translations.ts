import { MigrationInterface, QueryRunner } from 'typeorm';

import { machineTypeTranslationTemplatePtArUrData } from '../template-data';

export class UpdateDataTemplateForMachineTypeTranslations1712631370291
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await machineTypeTranslationTemplatePtArUrData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_type_translations');
    }
}
