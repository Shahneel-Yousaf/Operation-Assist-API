import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1698226624170 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //countries
        await queryRunner.createTable(
            new Table({
                name: 'countries',
                columns: [
                    {
                        name: 'country_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'country_code',
                        type: 'CHAR',
                        length: '2',
                        isUnique: true,
                    },
                ],
            }),
        );

        //user_histories
        await queryRunner.createTable(
            new Table({
                name: 'user_histories',
                columns: [
                    {
                        name: 'user_history_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'event_type',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATE', 'UPDATE', 'DELETE'],
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
                        name: 'name',
                        type: 'NVARCHAR',
                        length: '128',
                        isNullable: true,
                    },
                    {
                        name: 'picture_url',
                        type: 'VARCHAR',
                        length: '512',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'VARCHAR',
                        length: '320',
                        isNullable: true,
                    },
                    {
                        name: 'iso_locale_code',
                        type: 'VARCHAR',
                        length: '10',
                        isNullable: true,
                    },
                    {
                        name: 'mobile_phone_number',
                        type: 'NVARCHAR',
                        length: '128',
                        isNullable: true,
                    },
                    {
                        name: 'company_name',
                        type: 'NVARCHAR',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'current_status',
                        type: 'VARCHAR',
                        length: '128',
                        enum: ['CREATED', 'UPDATED', 'DELETED'],
                    },
                ],
            }),
        );

        //group_machine_assignment_histories
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
                    },
                ],
            }),
        );

        //machine_manufacturers
        await queryRunner.createTable(
            new Table({
                name: 'machine_manufacturers',
                columns: [
                    {
                        name: 'machine_manufacturer_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    },
                    {
                        name: 'machine_manufacturer_name',
                        type: 'NVARCHAR',
                        length: '128',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('countries', true, true);
        await queryRunner.dropTable('user_histories', true, true);
        await queryRunner.dropTable(
            'group_machine_assignment_histories',
            true,
            true,
        );
        await queryRunner.dropTable('machine_manufacturers', true, true);
    }
}
