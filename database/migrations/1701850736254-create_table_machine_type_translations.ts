import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class CreateTableMachineTypeTranslations1701850736254
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // machine_type_translations
        await queryRunner.createTable(
            new Table({
                name: 'machine_type_translations',
                columns: [
                    new TableColumn({
                        name: 'machine_type_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        isPrimary: true,
                        enum: ['ja', 'es-CL', 'en-US'],
                        default: "'en-US'",
                    }),
                    new TableColumn({
                        name: 'type_name',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                ],
            }),
            true,
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //machine_type_translations
            {
                keys: [['machine_type_id', 'machine_type_id', 'machine_types']],
                table: 'machine_type_translations',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(
            'machine_type_translations',
            true,
            true,
            true,
        );
    }
}
