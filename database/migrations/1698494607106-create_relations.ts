import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateRelations1698494607106 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //group_machine_assignment_histories
            {
                keys: [
                    ['group_id', 'group_id', 'groups'],
                    ['actioned_by_user_id', 'user_id', 'users'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'group_machine_assignment_histories',
            },
            //user_histories
            {
                keys: [
                    ['user_id', 'user_id', 'users'],
                    ['actioned_by_user_id', 'user_id', 'users'],
                ],
                table: 'user_histories',
                onDelete: 'NO ACTION',
            },
            //users
            {
                keys: [['country_of_residence_id', 'country_id', 'countries']],
                table: 'users',
            },
            //machine_histories
            {
                keys: [
                    [
                        'machine_manufacturer_id',
                        'machine_manufacturer_id',
                        'machine_manufacturers',
                    ],
                ],
                table: 'machine_histories',
            },
            {
                keys: [['machine_type_id', 'machine_type_id', 'machine_types']],
                table: 'machine_histories',
                onDelete: 'NO ACTION',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //group_machine_assignment_histories
            [
                'group_machine_assignment_histories',
                'FK_6dbc392f82bbcf9eda8657f65e3',
            ],
            [
                'group_machine_assignment_histories',
                'FK_0bee2e3ba087466689a7e0ac0a3',
            ],
            [
                'group_machine_assignment_histories',
                'FK_2122a288b03d47491b63cb170ec',
            ],
            //user_histories
            ['user_histories', 'FK_de3cbd852ec3d0d8e8b8f1eb27b'],
            ['user_histories', 'FK_a0c6e78fffeccd1b8115e32d056'],
            //users
            ['users', 'FK_864f434694533429f55d71abd35'],
            //machine_histories
            ['machine_histories', 'FK_be9bfc598ca8fc21d0415727376'],
            ['machine_histories', 'FK_588bc1dcc86c4f9e339999c5134'],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
