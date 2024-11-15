import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateRelationMachineReport1707295696076
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            // machine_reports
            {
                keys: [
                    [
                        'inspection_result_id',
                        'inspection_result_id',
                        'inspection_results',
                    ],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'machine_reports',
            },
            // machine_report_histories
            {
                keys: [
                    [
                        'machine_report_id',
                        'machine_report_id',
                        'machine_reports',
                    ],
                    [
                        'inspection_result_id',
                        'inspection_result_id',
                        'inspection_results',
                    ],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'machine_report_histories',
                onDelete: 'NO ACTION',
            },
            // machine_report_responses
            {
                keys: [
                    [
                        'machine_report_id',
                        'machine_report_id',
                        'machine_reports',
                    ],
                    ['user_id', 'user_id', 'users'],
                ],
                table: 'machine_report_responses',
            },
            // machine_report_medias
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'machine_report_responses',
                    ],
                ],
                table: 'machine_report_medias',
            },
            // report_actions
            {
                keys: [
                    [
                        'report_action_choice_id',
                        'report_action_choice_id',
                        'report_action_choices',
                    ],
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'machine_report_responses',
                    ],
                ],
                table: 'report_actions',
            },
            // report_action_choice_translations
            {
                keys: [
                    [
                        'report_action_choice_id',
                        'report_action_choice_id',
                        'report_action_choices',
                    ],
                ],
                table: 'report_action_choice_translations',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            // machine_reports
            ['machine_reports', 'FK_4abef275f8aaddf44d828f3831b'],
            ['machine_reports', 'FK_9acd2bc6db02fcc14b3e0179192'],
            // machine_report_histories
            ['machine_report_histories', 'FK_53fe83fadd26d969f5b706e41b1'],
            ['machine_report_histories', 'FK_10a4e082837ad83172434be9429'],
            ['machine_report_histories', 'FK_7b41b449c69f96c7eac1ab8b28b'],
            // machine_report_responses
            ['machine_report_responses', 'FK_24094498bcb586964f361ed310f'],
            ['machine_report_responses', 'FK_96c2b89cfb65f02638dfd950d9d'],
            // machine_report_medias
            ['machine_report_medias', 'FK_323ad62c380a3447d7e5e1f03e7'],
            // report_actions
            ['report_actions', 'FK_139f1b907622d848782cb4bbfa8'],
            ['report_actions', 'FK_1c4e7ac61558eae66ef209162ac'],
            // report_action_choice_translations
            [
                'report_action_choice_translations',
                'FK_f3b6a65218b4dfe7e4effda1402',
            ],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
