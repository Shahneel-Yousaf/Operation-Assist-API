import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import {
    machineTypeTemplateData,
    machineTypeTranslationTemplateData,
} from '../template-data';

export class UpdateTemplateDataTableMachineTypeTranslations1701852889324
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await machineTypeTranslationTemplateData(queryRunner);

        await queryRunner.query(`
            ALTER TABLE machine_types DROP COLUMN type_name;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_type_translations');

        await queryRunner.addColumn(
            'machine_types',
            new TableColumn({
                name: 'type_name',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
        );

        await machineTypeTemplateData(queryRunner);

        await queryRunner.query(`
            ALTER TABLE machine_types ALTER COLUMN type_name NVARCHAR(128) NOT NULL;
        `);
    }
}
