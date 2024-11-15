import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class UpdateRelationTable1709632753630 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //custom_inspection_form_histories
            {
                keys: [
                    [
                        'custom_inspection_form_id',
                        'custom_inspection_form_id',
                        'custom_inspection_forms',
                    ],
                ],
                table: 'custom_inspection_form_histories',
            },
            //custom_inspection_item_histories
            {
                keys: [
                    ['actioned_by_user_id', 'user_id', 'users'],
                    [
                        'custom_inspection_item_id',
                        'custom_inspection_item_id',
                        'custom_inspection_items',
                    ],
                    [
                        'custom_inspection_form_history_id',
                        'custom_inspection_form_history_id',
                        'custom_inspection_form_histories',
                    ],
                ],
                onDelete: 'NO ACTION',
                table: 'custom_inspection_item_histories',
            },
            //inspection_form_template_translations
            {
                keys: [
                    [
                        'inspection_form_template_id',
                        'inspection_form_template_id',
                        'inspection_form_templates',
                    ],
                ],
                table: 'inspection_form_template_translations',
            },
            // inspection_histories
            {
                keys: [
                    ['actioned_by_user_id', 'user_id', 'users'],
                    ['inspection_id', 'inspection_id', 'inspections'],
                    ['machine_id', 'machine_id', 'machines'],
                    [
                        'custom_inspection_form_id',
                        'custom_inspection_form_id',
                        'custom_inspection_forms',
                    ],
                ],
                table: 'inspection_histories',
            },
            // inspection_item_template_translations
            {
                keys: [
                    [
                        'inspection_item_id',
                        'inspection_item_id',
                        'inspection_item_templates',
                    ],
                ],
                table: 'inspection_item_template_translations',
            },
            //inspection_result_histories
            {
                keys: [
                    ['actioned_by_user_id', 'user_id', 'users'],
                    [
                        'inspection_result_id',
                        'inspection_result_id',
                        'inspection_results',
                    ],
                    [
                        'custom_inspection_item_id',
                        'custom_inspection_item_id',
                        'custom_inspection_items',
                    ],
                    [
                        'inspection_history_id',
                        'inspection_history_id',
                        'inspection_histories',
                    ],
                ],
                onDelete: 'NO ACTION',
                table: 'inspection_result_histories',
            },
            //machine_type_inspection_form_templates
            {
                keys: [
                    ['machine_type_id', 'machine_type_id', 'machine_types'],
                    [
                        'inspection_form_template_id',
                        'inspection_form_template_id',
                        'inspection_form_templates',
                    ],
                ],
                table: 'machine_type_inspection_form_templates',
            },
            //notifications
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'machine_report_responses',
                    ],
                    ['inspection_id', 'inspection_id', 'inspections'],
                ],
                onDelete: 'NO ACTION',
                table: 'notifications',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //custom_inspection_form_histories
            [
                'custom_inspection_form_histories',
                'FK_1df867df3ab1014b2cfc805d343',
            ],
            //custom_inspection_item_histories
            [
                'custom_inspection_item_histories',
                'FK_0dc8345e0ea9c49f6d8352b9261',
            ],
            [
                'custom_inspection_item_histories',
                'FK_ba34213f132a2d97f3bf726f091',
            ],
            [
                'custom_inspection_item_histories',
                'FK_497b8c53aa59f5b7a6cf2a54838',
            ],
            //inspection_form_template_translations
            [
                'inspection_form_template_translations',
                'FK_566c010192ffb37085fcd2c9085',
            ],
            //inspection_histories
            ['inspection_histories', 'FK_369665f2d3170d7ac56fb373cdf'],
            ['inspection_histories', 'FK_de93fd6e301d9ead7e7a2617cd8'],
            ['inspection_histories', 'FK_3b66413b7ae67f4c7d0baa4ccb6'],
            ['inspection_histories', 'FK_ffa2ca12ebff7da7de257e7811f'],
            //inspection_item_template_translations
            [
                'inspection_item_template_translations',
                'FK_961d512fb8a31c478a300fd2de7',
            ],
            //inspection_result_histories
            ['inspection_result_histories', 'FK_0185435487777c70cdbb49d8217'],
            ['inspection_result_histories', 'FK_66ef7e7fc5cf4935727745fe761'],
            ['inspection_result_histories', 'FK_c736788e9852399f250a4d3f165'],
            ['inspection_result_histories', 'FK_2f7a623b48699d725273293df13'],
            //machine_type_inspection_form_templates
            [
                'machine_type_inspection_form_templates',
                'FK_dd72d1340748ac975df04583734',
            ],
            [
                'machine_type_inspection_form_templates',
                'FK_cd787ac4e32a6111ac6f78f47cc',
            ],
            //notifications
            ['notifications', 'FK_641e3adc9d75e16d298d57aef25'],
            ['notifications', 'FK_60c416a624e2012f06df368cf71'],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
