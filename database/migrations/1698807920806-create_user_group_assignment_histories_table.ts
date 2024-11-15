import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class CreateUserGroupAssignmentHistoriesTable1698807920806
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_group_assignment_histories',
                columns: [
                    {
                        name: 'user_group_assignment_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: [
                            'USER_GROUP_ASSIGNMENT_START',
                            'USER_GROUP_ASSIGNMENT_END',
                        ],
                    },
                    {
                        name: 'event_at',
                        type: 'DATETIME2',
                        default: 'GETDATE()',
                    },
                    {
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'group_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                    },
                    {
                        name: 'user_group_role_name',
                        type: 'NVARCHAR',
                        length: '255',
                        enum: ['ASSIGNED', 'UNASSIGNED'],
                    },
                ],
            }),
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //user_group_assignment_histories
            {
                keys: [
                    ['actioned_by_user_id', 'user_id', 'users'],
                    ['user_id', 'user_id', 'users'],
                ],
                table: 'user_group_assignment_histories',
                onDelete: 'NO ACTION',
            },
            {
                keys: [['group_id', 'group_id', 'groups']],
                table: 'user_group_assignment_histories',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(
            'user_group_assignment_histories',
            true,
            true,
        );
    }
}
