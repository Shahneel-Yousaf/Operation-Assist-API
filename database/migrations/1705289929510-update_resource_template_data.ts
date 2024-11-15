import { MigrationInterface, QueryRunner } from 'typeorm';

import { resourceTemplateData } from '../template-data';

export class UpdateResourceTemplateData1705289929510
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await resourceTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM resources');
    }
}
