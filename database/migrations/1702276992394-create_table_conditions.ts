import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import {
    machineManufacturerTemplateData,
    machineTypeTranslationTemplateData,
} from '../template-data';

export class CreateTableConditions1702276992394 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // machine_conditions
        await queryRunner.createTable(
            new Table({
                name: 'machine_conditions',
                columns: [
                    new TableColumn({
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'machine_condition',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['NORMAL', 'WARNING', 'ERROR'],
                    }),
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                ],
            }),
            true,
        );

        // machine_condition_histories
        await queryRunner.createTable(
            new Table({
                name: 'machine_condition_histories',
                columns: [
                    new TableColumn({
                        name: 'machine_condition_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
                    }),
                    new TableColumn({
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'CURRENT_TIMESTAMP',
                    }),
                    new TableColumn({
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    }),
                    new TableColumn({
                        name: 'machine_condition',
                        type: 'VARCHAR',
                        length: '32',
                        enum: ['NORMAL', 'WARNING', 'ERROR'],
                    }),
                ],
            }),
            true,
        );

        // Update template data machineManufacturer add OTHERS
        await machineManufacturerTemplateData(queryRunner);
        // Update template data machine_type_translations others -> OTHERS (en-US)
        await machineTypeTranslationTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // machine_conditions
        await queryRunner.dropTable('machine_conditions', true, true, true);

        // machine_condition_histories
        await queryRunner.dropTable(
            'machine_condition_histories',
            true,
            true,
            true,
        );

        await queryRunner.query(`
            DELETE machine_manufacturers
            WHERE machine_manufacturer_id = '0665TE1NFG6ZXQXXYYNY15V0NW';
        `);

        await queryRunner.query(`
            UPDATE
                machine_type_translations
            SET
                type_name = 'Others'
            WHERE
                machine_type_id = '0661J7JX6ZDP4HXM46349GPFHW'
                AND iso_locale_code = 'en-US';
        `);
    }
}
