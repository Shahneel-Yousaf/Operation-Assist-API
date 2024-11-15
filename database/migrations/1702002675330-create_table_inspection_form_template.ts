import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateTableInspectionFormTemplate1702002675330
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // inspection_form_templates
        await queryRunner.createTable(
            new Table({
                name: 'inspection_form_templates',
                columns: [
                    new TableColumn({
                        name: 'inspection_form_template_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'created_at',
                        type: 'DATETIME2',
                    }),
                ],
            }),
            true,
        );

        // inspection_form_template_translations
        await queryRunner.createTable(
            new Table({
                name: 'inspection_form_template_translations',
                columns: [
                    new TableColumn({
                        name: 'inspection_form_template_id',
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
                        name: 'inspection_form_template_name',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                ],
            }),
            true,
        );

        // inspection_item_templates
        await queryRunner.createTable(
            new Table({
                name: 'inspection_item_templates',
                columns: [
                    new TableColumn({
                        name: 'inspection_item_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'inspection_form_template_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'is_immutable_item',
                        type: 'BIT',
                        default: 0,
                    }),
                    new TableColumn({
                        name: 'is_forced_required_item',
                        type: 'BIT',
                        default: 0,
                    }),
                    new TableColumn({
                        name: 'position',
                        type: 'INT',
                        default: 0,
                    }),
                    new TableColumn({
                        name: 'result_type',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['OK_OR_ANOMARY', 'NUMERIC'],
                    }),
                ],
            }),
            true,
        );

        // inspection_item_template_translations
        await queryRunner.createTable(
            new Table({
                name: 'inspection_item_template_translations',
                columns: [
                    new TableColumn({
                        name: 'inspection_item_id',
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
                        name: 'item_name',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                    new TableColumn({
                        name: 'item_description',
                        type: 'NVARCHAR',
                        length: '128',
                    }),
                ],
            }),
            true,
        );

        // machine_type_inspection_form_templates
        await queryRunner.createTable(
            new Table({
                name: 'machine_type_inspection_form_templates',
                columns: [
                    new TableColumn({
                        name: 'machine_type_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'inspection_form_template_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // inspection_form_templates
        await queryRunner.dropTable(
            'inspection_form_templates',
            true,
            true,
            true,
        );

        // inspection_form_template_translations
        await queryRunner.dropTable(
            'inspection_form_template_translations',
            true,
            true,
            true,
        );

        // inspection_item_templates
        await queryRunner.dropTable(
            'inspection_item_templates',
            true,
            true,
            true,
        );

        // inspection_item_template_translations
        await queryRunner.dropTable(
            'inspection_item_template_translations',
            true,
            true,
            true,
        );

        // machine_type_inspection_form_templates
        await queryRunner.dropTable(
            'machine_type_inspection_form_templates',
            true,
            true,
            true,
        );
    }
}
