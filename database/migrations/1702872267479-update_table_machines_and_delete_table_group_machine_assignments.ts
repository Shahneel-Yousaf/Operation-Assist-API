import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class UpdateTableMachinesAndDeleteTableGroupMachineAssignments1702872267479
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'machines',
            new TableColumn({
                name: 'group_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );

        await queryRunner.addColumn(
            'machine_histories',
            new TableColumn({
                name: 'group_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );

        await queryRunner.query(`
            UPDATE
                machines
            SET
                machines.group_id = group_machine_assignments.group_id
            FROM
                group_machine_assignments
            WHERE
                machines.machine_id = group_machine_assignments.machine_id;
        `);

        await queryRunner.query(`
            UPDATE
                machine_histories
            SET
                machine_histories.group_id = group_machine_assignments.group_id
            FROM
                group_machine_assignments
            WHERE
                machine_histories.machine_id = group_machine_assignments.machine_id;
        `);

        await queryRunner.query(`
            ALTER TABLE group_machine_assignments ALTER COLUMN group_id CHAR(26) NOT NULL;
        `);

        await queryRunner.query(`
            ALTER TABLE group_machine_assignment_histories ALTER COLUMN group_id CHAR(26) NOT NULL;
        `);

        // group_machine_assignments
        await queryRunner.dropTable(
            'group_machine_assignments',
            true,
            true,
            true,
        );

        // group_machine_assignment_histories
        await queryRunner.dropTable(
            'group_machine_assignment_histories',
            true,
            true,
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            {
                keys: [
                    ['group_id', 'group_id', 'groups'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'group_machine_assignments',
            },
            {
                keys: [
                    ['group_id', 'group_id', 'groups'],
                    ['actioned_by_user_id', 'user_id', 'users'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'group_machine_assignment_histories',
            },
        ];

        await queryRunner.createTable(
            new Table({
                name: 'group_machine_assignments',
                columns: [
                    {
                        name: 'group_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'last_status_updated_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['UNASSIGNED', 'ASSIGNED'],
                    },
                ],
            }),
        );

        await queryRunner.createTable(
            new Table({
                name: 'group_machine_assignment_histories',
                columns: [
                    {
                        name: 'group_machine_assignment_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: [
                            'GROUP_MACHINE_ASSIGNMENT_START',
                            'GROUP_MACHINE_ASSIGNMENT_END',
                        ],
                    },
                    {
                        name: 'event_at',
                        type: 'DATETIME2',
                    },
                    {
                        name: 'actioned_by_user_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'group_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'machine_id',
                        type: 'CHAR',
                        length: '26',
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['UNASSIGNED', 'ASSIGNED'],
                    },
                ],
            }),
        );

        await createForeignKeys(foreignKeys, queryRunner);

        await queryRunner.dropColumn('machine_histories', 'group_id');

        await queryRunner.dropColumn('machines', 'group_id');
    }
}
