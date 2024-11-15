import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class CreateUserGroupMachineFavoritesTable1700708361291
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // user_group_machine_favorites
        await queryRunner.createTable(
            new Table({
                name: 'user_group_machine_favorites',
                columns: [
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'group_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                ],
            }),
            true,
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //user_group_machine_favorites
            {
                keys: [
                    ['user_id', 'user_id', 'users'],
                    ['group_id', 'group_id', 'groups'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'user_group_machine_favorites',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(
            'user_group_machine_favorites',
            true,
            true,
            true,
        );
    }
}
