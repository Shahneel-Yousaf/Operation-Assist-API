import { MigrationInterface, QueryRunner } from 'typeorm';

import { machineTypeTranslationTemplateEnJaEsData } from '../template-data';

export class UpdateMachineTypeTranslationTemplateData1714012698476
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await machineTypeTranslationTemplateEnJaEsData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_type_translations');
    }
}
