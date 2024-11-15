import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateInspectionRelations1708308744269
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //custom_inspection_forms
            {
                keys: [['machine_id', 'machine_id', 'machines']],
                table: 'custom_inspection_forms',
                onDelete: 'NO ACTION',
            },
            //custom_inspection_item_medias
            {
                keys: [
                    [
                        'custom_inspection_item_id',
                        'custom_inspection_item_id',
                        'custom_inspection_items',
                    ],
                ],
                table: 'custom_inspection_item_medias',
            },
            //custom_inspection_items
            {
                keys: [
                    [
                        'custom_inspection_form_id',
                        'custom_inspection_form_id',
                        'custom_inspection_forms',
                    ],
                ],
                table: 'custom_inspection_items',
            },
            //inspection_item_templates
            {
                keys: [
                    [
                        'inspection_form_template_id',
                        'inspection_form_template_id',
                        'inspection_form_templates',
                    ],
                ],
                table: 'inspection_item_templates',
            },
            // inspection_results
            {
                keys: [
                    ['inspection_id', 'inspection_id', 'inspections'],
                    [
                        'custom_inspection_item_id',
                        'custom_inspection_item_id',
                        'custom_inspection_items',
                    ],
                ],
                table: 'inspection_results',
            },
            // inspections
            {
                keys: [
                    ['machine_id', 'machine_id', 'machines'],
                    [
                        'custom_inspection_form_id',
                        'custom_inspection_form_id',
                        'custom_inspection_forms',
                    ],
                ],
                table: 'inspections',
                onDelete: 'NO ACTION',
            },
            //custom_inspection_form_histories
            {
                keys: [['actioned_by_user_id', 'user_id', 'users']],
                table: 'custom_inspection_form_histories',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //custom_inspection_forms
            ['custom_inspection_forms', 'FK_ab08015cd5b634e616401413bff'],
            //custom_inspection_item_medias
            ['custom_inspection_item_medias', 'FK_433144f0e6c29f6cf336ea921cc'],
            //custom_inspection_items
            ['custom_inspection_items', 'FK_78173f7183f4659bfeeeb30daeb'],
            //inspection_item_templates
            ['inspection_item_templates', 'FK_88b9f13b3f450cab081c1ff4f9f'],
            // inspection_results
            ['inspection_results', 'FK_05f913e654de1e86ac6bb624218'],
            ['inspection_results', 'FK_309a38a03aa875e686ce0d00606'],
            // inspections
            ['inspections', 'FK_a34195b3a196f95bdabb9dbb988'],
            ['inspections', 'FK_ccace26e057183cf86006ea54b2'],
            //custom_inspection_form_histories
            [
                'custom_inspection_form_histories',
                'FK_87f1eb289b3447772107085da7c',
            ],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
