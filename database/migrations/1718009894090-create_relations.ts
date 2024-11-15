import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateRelations1718009894090 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //machine_operation_reports
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'machine_report_responses',
                    ],
                ],
                table: 'machine_operation_reports',
            },
            //fuel_maintenance_reports
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'machine_report_responses',
                    ],
                ],
                table: 'fuel_maintenance_reports',
            },
            //fuel_refills
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'fuel_maintenance_reports',
                    ],
                ],
                table: 'fuel_refills',
            },
            //oil_coolant_refill_exchanges
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'fuel_maintenance_reports',
                    ],
                    ['oil_type_id', 'oil_type_id', 'oil_types'],
                ],
                table: 'oil_coolant_refill_exchanges',
            },
            //oil_type_translations
            {
                keys: [['oil_type_id', 'oil_type_id', 'oil_types']],
                table: 'oil_type_translations',
            },
            //part_replacements
            {
                keys: [
                    [
                        'machine_report_response_id',
                        'machine_report_response_id',
                        'machine_report_responses',
                    ],
                    ['part_type_id', 'part_type_id', 'part_types'],
                ],
                table: 'part_replacements',
            },
            //part_type_translations
            {
                keys: [['part_type_id', 'part_type_id', 'part_types']],
                table: 'part_type_translations',
            },
            //part_replacement_medias
            {
                keys: [
                    [
                        'part_replacement_id',
                        'part_replacement_id',
                        'part_replacements',
                    ],
                ],
                table: 'part_replacement_medias',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //machine_operation_reports
            ['machine_operation_reports', 'FK_3ccf0ceb9f1cb3857dc848b25be'],
            //fuel_maintenance_reports
            ['fuel_maintenance_reports', 'FK_0a89e1e5de16bdfed6498e5b11f'],
            //fuel_refills
            ['fuel_refills', 'FK_eb0316612638f33422be3373e70'],
            //oil_coolant_refill_exchanges
            ['oil_coolant_refill_exchanges', 'FK_14e102b6d55c2132f325646c606'],
            ['oil_coolant_refill_exchanges', 'FK_cb435bd28a60ea2d0f15109ef80'],
            //oil_type_translations
            ['oil_type_translations', 'FK_c37780517bad70c5292cf6b0037'],
            //part_replacements
            ['part_replacements', 'FK_41bc5d864558e4e56ce4dafd1dc'],
            ['part_replacements', 'FK_8053763ad21c4ea5b12a5f76889'],
            //part_type_translations
            ['part_type_translations', 'FK_43ce8e01d82e899c3aecd9a83d4'],
            //part_replacement_medias
            ['part_replacement_medias', 'FK_94469498bdfc6bad51db03829a7'],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
