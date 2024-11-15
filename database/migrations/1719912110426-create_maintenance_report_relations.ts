import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateMaintenanceReportRelations1719912110426
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //maintenance_reports
            {
                keys: [
                    [
                        'regular_maintenance_item_choice_id',
                        'regular_maintenance_item_choice_id',
                        'regular_maintenance_item_choices',
                    ],
                    [
                        'maintenance_reason_choice_id',
                        'maintenance_reason_choice_id',
                        'maintenance_reason_choices',
                    ],
                    [
                        'maintenance_reason_period_choice_id',
                        'maintenance_reason_period_choice_id',
                        'maintenance_reason_period_choices',
                    ],
                ],
                table: 'maintenance_reports',
            },
            //maintenance_report_irregular_maintenance_items
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'maintenance_reports',
                    ],
                    [
                        'irregular_maintenance_item_choice_id',
                        'irregular_maintenance_item_choice_id',
                        'irregular_maintenance_item_choices',
                    ],
                ],
                table: 'maintenance_report_irregular_maintenance_items',
            },
            //irregular_maintenance_item_choice_translations
            {
                keys: [
                    [
                        'irregular_maintenance_item_choice_id',
                        'irregular_maintenance_item_choice_id',
                        'irregular_maintenance_item_choices',
                    ],
                ],
                table: 'irregular_maintenance_item_choice_translations',
            },
            //regular_maintenance_item_choice_translations
            {
                keys: [
                    [
                        'regular_maintenance_item_choice_id',
                        'regular_maintenance_item_choice_id',
                        'regular_maintenance_item_choices',
                    ],
                ],
                table: 'regular_maintenance_item_choice_translations',
            },
            //maintenance_reason_period_choice_translations
            {
                keys: [
                    [
                        'maintenance_reason_period_choice_id',
                        'maintenance_reason_period_choice_id',
                        'maintenance_reason_period_choices',
                    ],
                ],
                table: 'maintenance_reason_period_choice_translations',
            },
            //maintenance_reason_choice_translations
            {
                keys: [
                    [
                        'maintenance_reason_choice_id',
                        'maintenance_reason_choice_id',
                        'maintenance_reason_choices',
                    ],
                ],
                table: 'maintenance_reason_choice_translations',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //maintenance_reports
            ['maintenance_reports', 'FK_a6b878ddf1de87d683673e973fb'],
            ['maintenance_reports', 'FK_3f5bb3cfe4c98ebcfed1e500eb2'],
            ['maintenance_reports', 'FK_8adca857ff5968adc2548b4bbc5'],
            //maintenance_report_irregular_maintenance_items
            [
                'maintenance_report_irregular_maintenance_items',
                'FK_25945728df60b70f319a606375c',
            ],
            [
                'maintenance_report_irregular_maintenance_items',
                'FK_9f4f06b046e1462ab618dfaecb2',
            ],
            //irregular_maintenance_item_choice_translations
            [
                'irregular_maintenance_item_choice_translations',
                'FK_762f7b436d90d0cb6dbc878ff47',
            ],
            //regular_maintenance_item_choice_translations
            [
                'regular_maintenance_item_choice_translations',
                'FK_b605ff1444cdb594d5de75a440d',
            ],
            // maintenance_reason_period_choice_translations
            [
                'maintenance_reason_period_choice_translations',
                'FK_98856d04c131795e8005498f63b',
            ],
            // maintenance_reason_choice_translations
            [
                'maintenance_reason_choice_translations',
                'FK_fd5e87b36e936c8021b203c6764',
            ],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
