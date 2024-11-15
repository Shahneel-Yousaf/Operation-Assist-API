import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import {
    inspectionItemTemplateTemplateData,
    inspectionItemTemplateTemplateData1705975344125,
} from '../template-data';

export class UpdateInspectionItemsTable1705975344125
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //inspection_item_templates
        await queryRunner.addColumn(
            'inspection_item_templates',
            new TableColumn({
                name: 'item_code',
                type: 'VARCHAR(64)',
                enum: ['SERVICE_METER', 'ODOMETER'],
                isNullable: true,
            }),
        );

        //custom_inspection_items
        await queryRunner.addColumn(
            'custom_inspection_items',
            new TableColumn({
                name: 'item_code',
                type: 'VARCHAR(64)',
                enum: ['SERVICE_METER', 'ODOMETER'],
                isNullable: true,
            }),
        );

        //custom_inspection_item_histories
        await queryRunner.addColumn(
            'custom_inspection_item_histories',
            new TableColumn({
                name: 'item_code',
                type: 'VARCHAR(64)',
                enum: ['SERVICE_METER', 'ODOMETER'],
                isNullable: true,
            }),
        );

        //inspection_results
        await queryRunner.addColumn(
            'inspection_results',
            new TableColumn({
                name: 'item_code',
                type: 'VARCHAR(64)',
                enum: ['SERVICE_METER', 'ODOMETER'],
                isNullable: true,
            }),
        );

        //inspection_result_histories
        await queryRunner.addColumn(
            'inspection_result_histories',
            new TableColumn({
                name: 'item_code',
                type: 'VARCHAR(64)',
                enum: ['SERVICE_METER', 'ODOMETER'],
                isNullable: true,
            }),
        );

        await inspectionItemTemplateTemplateData1705975344125(queryRunner);

        await queryRunner.query(
            `UPDATE custom_inspection_items
            SET item_code =
            CASE
                WHEN name = 'Service meter/SMR (h)' OR name = 'サービスメーター/SMR (h)' THEN 'SERVICE_METER'
                WHEN name = 'Odometer (km)' OR name = 'オドメーター (km)' THEN 'ODOMETER'
                ELSE NULL
            END;`,
        );

        await queryRunner.query(
            `UPDATE custom_inspection_item_histories
            SET item_code =
            CASE
                WHEN name = 'Service meter/SMR (h)' OR name = 'サービスメーター/SMR (h)' THEN 'SERVICE_METER'
                WHEN name = 'Odometer (km)' OR name = 'オドメーター (km)' THEN 'ODOMETER'
                ELSE NULL
            END;`,
        );

        await queryRunner.query(
            `UPDATE inspection_results
            SET item_code =
            CASE
                WHEN name = 'Service meter/SMR (h)' OR name = 'サービスメーター/SMR (h)' THEN 'SERVICE_METER'
                WHEN name = 'Odometer (km)' OR name = 'オドメーター (km)' THEN 'ODOMETER'
                ELSE NULL
            END
            FROM custom_inspection_items
            WHERE custom_inspection_items.custom_inspection_item_id = inspection_results.custom_inspection_item_id;
            `,
        );

        await queryRunner.query(
            `UPDATE inspection_result_histories
            SET item_code =
            CASE
                WHEN name = 'Service meter/SMR (h)' OR name = 'サービスメーター/SMR (h)' THEN 'SERVICE_METER'
                WHEN name = 'Odometer (km)' OR name = 'オドメーター (km)' THEN 'ODOMETER'
                ELSE NULL
            END
            FROM custom_inspection_items
            WHERE custom_inspection_items.custom_inspection_item_id = inspection_result_histories.custom_inspection_item_id;
            `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await inspectionItemTemplateTemplateData(queryRunner);

        await queryRunner.query(
            'ALTER TABLE inspection_item_templates DROP CONSTRAINT CHK_b2c43729e3f30d8dfbdef54d7c_ENUM;',
        );
        await queryRunner.query(
            'ALTER TABLE custom_inspection_items DROP CONSTRAINT CHK_6ea7731c217c1bccd529576914_ENUM;',
        );
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_histories DROP CONSTRAINT CHK_12728258dc884ad5dffaf67681_ENUM;',
        );
        await queryRunner.query(
            'ALTER TABLE inspection_results DROP CONSTRAINT CHK_2184b9472e22cc7bba012f07d3_ENUM;',
        );
        await queryRunner.query(
            'ALTER TABLE inspection_result_histories DROP CONSTRAINT CHK_d6afc2f553dddbf01e1bb8f708_ENUM;',
        );
        await queryRunner.dropColumn('inspection_item_templates', 'item_code');
        await queryRunner.dropColumn('custom_inspection_items', 'item_code');
        await queryRunner.dropColumn(
            'custom_inspection_item_histories',
            'item_code',
        );
        await queryRunner.dropColumn('inspection_results', 'item_code');
        await queryRunner.dropColumn(
            'inspection_result_histories',
            'item_code',
        );
    }
}
