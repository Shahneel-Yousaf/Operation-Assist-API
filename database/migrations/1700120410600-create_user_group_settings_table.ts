import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class CreateUserGroupSettingsTable1700120410600
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_group_settings',
                columns: [
                    {
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'group_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'is_archived',
                        type: 'BIT',
                        default: 0,
                    },
                ],
            }),
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //user_group_settings
            {
                keys: [['group_id', 'group_id', 'groups']],
                table: 'user_group_settings',
            },
            {
                keys: [['user_id', 'user_id', 'users']],
                table: 'user_group_settings',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);

        await queryRunner.query(`
            INSERT INTO user_group_settings (user_id, group_id)
            SELECT user_group_assignments.user_id, user_group_assignments.group_id
            FROM user_group_assignments;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_group_settings', true, true);
    }
}
