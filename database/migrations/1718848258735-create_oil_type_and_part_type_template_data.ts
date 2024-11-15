import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    oilTypeTemplateData,
    oilTypeTranslationTemplateData,
    partTypeTemplateData,
    partTypeTranslationTemplateData,
} from '../template-data';

export class CreateOilTypeAndPartTypeTemplateData1718848258735
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await oilTypeTemplateData(queryRunner);
        await partTypeTemplateData(queryRunner);
        await oilTypeTranslationTemplateData(queryRunner);
        await partTypeTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM oil_types');
        await queryRunner.query('DELETE FROM part_types');
        await queryRunner.query('DELETE FROM oil_type_translations');
        await queryRunner.query('DELETE FROM part_type_translations');
    }
}
