import { MigrationInterface, QueryRunner } from 'typeorm';

import { machineTypeTranslationTemplateData } from '../template-data';

export class UpdateDataTemplateForMachineTypeTranslations1710729425123
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await machineTypeTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_type_translations');
    }
}
