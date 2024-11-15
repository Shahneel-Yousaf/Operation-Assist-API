import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateRelations1707986584311 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //user_settings
            {
                keys: [['user_id', 'user_id', 'users']],
                table: 'user_settings',
            },
            //user_group_assignments
            {
                keys: [
                    [
                        'user_group_role_template_id',
                        'user_group_role_template_id',
                        'user_group_role_templates',
                    ],
                ],
                table: 'user_group_assignments',
            },
            //group_invitations
            {
                keys: [
                    [
                        'user_group_role_template_id',
                        'user_group_role_template_id',
                        'user_group_role_templates',
                    ],
                ],
                table: 'group_invitations',
            },
            //machine_conditions
            {
                keys: [
                    ['machine_id', 'machine_id', 'machines'],
                    ['user_id', 'user_id', 'users'],
                ],
                table: 'machine_conditions',
            },
            //machine_condition_histories
            {
                keys: [
                    ['actioned_by_user_id', 'user_id', 'users'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'machine_condition_histories',
            },
            //machine_histories
            {
                keys: [['group_id', 'group_id', 'groups']],
                table: 'machine_histories',
            },
            //machines
            {
                keys: [['group_id', 'group_id', 'groups']],
                table: 'machines',
                onDelete: 'NO ACTION',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //user_settings
            ['user_settings', 'FK_4ed056b9344e6f7d8d46ec4b302'],
            //user_group_assignments
            ['user_group_assignments', 'FK_5f000be3e9916025140ce4c5f82'],
            //group_invitations
            ['group_invitations', 'FK_b34a201d1c2b3c433cb277cd499'],
            //machines
            ['machines', 'FK_58f7eda33d4cab9cf330af7603e'],
            //machine_conditions
            ['machine_conditions', 'FK_c9ba70dd3e12ded188e6e8fdc07'],
            ['machine_conditions', 'FK_2d85e9bf99e5250893ef916c5a5'],
            //machine_condition_histories
            ['machine_condition_histories', 'FK_da964c507c3a6016e08070ecf25'],
            ['machine_condition_histories', 'FK_267b516db2b376dd3741276681b'],
            //machine_histories
            ['machine_histories', 'FK_705bcf38ea1c249043a3f3e7dcd'],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
