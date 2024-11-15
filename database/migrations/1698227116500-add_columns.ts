import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumns1698227116500 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //group_histories
        await queryRunner.addColumns('group_histories', [
            new TableColumn({
                name: 'current_status',
                type: 'VARCHAR',
                length: '128',
                enum: [
                    'CREATED',
                    'UPDATED',
                    'ARCHIVED',
                    'UNARCHIVED',
                    'DELETED',
                ],
                isNullable: true,
            }),
        ]);

        //users
        await queryRunner.addColumns('users', [
            new TableColumn({
                name: 'search_id',
                type: 'CHAR(7)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'surname',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'is_searchable_by_email',
                type: 'BIT',
                default: 0,
            }),
            new TableColumn({
                name: 'country_of_residence_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'date_of_birth',
                type: 'DATE',
                isNullable: true,
            }),
            new TableColumn({
                name: 'current_status',
                type: 'VARCHAR(128)',
                enum: ['CREATED', 'UPDATED', 'DELETED'],
                isNullable: true,
            }),
            new TableColumn({
                name: 'last_status_updated_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
        ]);

        await queryRunner.query(`UPDATE users SET surname = 'surname';`);

        await queryRunner.query(
            `ALTER TABLE users ALTER COLUMN surname NVARCHAR(128) NOT NULL`,
        );

        await queryRunner.query(`UPDATE users SET current_status = 'CREATED'`);

        await queryRunner.query(
            `ALTER TABLE users ALTER COLUMN current_status VARCHAR(128) NOT NULL`,
        );

        //groups
        await queryRunner.addColumns('groups', [
            new TableColumn({
                name: 'current_status',
                type: 'VARCHAR',
                length: '128',
                enum: [
                    'CREATED',
                    'UPDATED',
                    'ARCHIVED',
                    'UNARCHIVED',
                    'DELETED',
                ],
                isNullable: true,
            }),
            new TableColumn({
                name: 'last_status_updated_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
        ]);

        await queryRunner.query(`UPDATE groups SET current_status ='CREATED';`);

        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN current_status VARCHAR(128) NOT NULL;',
        );

        await queryRunner.query(
            'UPDATE groups SET last_status_updated_at = GETDATE();',
        );

        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN last_status_updated_at DATETIME2 NOT NULL;',
        );

        //group_machine_assignments
        await queryRunner.addColumn(
            'group_machine_assignments',
            new TableColumn({
                name: 'current_status',
                type: 'VARCHAR',
                length: '128',
                isNullable: true,
            }),
        );

        await queryRunner.query(
            `UPDATE group_machine_assignments SET current_status = 'current status group machine assignment'`,
        );

        await queryRunner.query(
            `ALTER TABLE group_machine_assignments ALTER COLUMN current_status VARCHAR(128) NOT NULL`,
        );

        //machines
        await queryRunner.addColumns('machines', [
            new TableColumn({
                name: 'picture_url',
                type: 'VARCHAR',
                length: '512',
            }),
            new TableColumn({
                name: 'machine_manufacturer_id',
                type: 'CHAR',
                length: '26',
            }),
            new TableColumn({
                name: 'model_and_type',
                type: 'NVARCHAR',
                length: '128',
            }),
            new TableColumn({
                name: 'serial_number',
                type: 'NVARCHAR',
                length: '128',
            }),
            new TableColumn({
                name: 'serial_number_plate_picture_url',
                type: 'NVARCHAR',
                length: '512',
            }),
            new TableColumn({
                name: 'current_status',
                type: 'VARCHAR',
                length: '128',
                enum: ['CREATED', 'UPDATED', 'ARCHIVED', 'DELETED'],
            }),
            new TableColumn({
                name: 'last_status_updated_at',
                type: 'DATETIME2',
            }),
        ]);

        //machine_histories
        await queryRunner.addColumns('machine_histories', [
            new TableColumn({
                name: 'picture_url',
                type: 'VARCHAR',
                length: '512',
            }),
            new TableColumn({
                name: 'machine_manufacturer_id',
                type: 'CHAR',
                length: '26',
            }),
            new TableColumn({
                name: 'model_and_type',
                type: 'NVARCHAR',
                length: '128',
            }),
            new TableColumn({
                name: 'serial_number',
                type: 'NVARCHAR',
                length: '128',
            }),
            new TableColumn({
                name: 'serial_number_plate_picture_url',
                type: 'VARCHAR',
                length: '512',
            }),
            new TableColumn({
                name: 'current_status',
                type: 'VARCHAR',
                length: '128',
                enum: [
                    'CREATED',
                    'UPDATED',
                    'ARCHIVED',
                    'UNARCHIVED',
                    'DELETED',
                ],
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('group_histories', 'current_status');

        await queryRunner.query(
            'ALTER TABLE users DROP CONSTRAINT  CHK_48044310f30efd86223711f018_ENUM;',
        );

        await queryRunner.dropColumns('users', [
            'search_id',
            'surname',
            'is_searchable_by_email',
            'country_of_residence_id',
            'date_of_birth',
            'current_status',
            'last_status_updated_at',
        ]);

        await queryRunner.query(
            'ALTER TABLE groups DROP CONSTRAINT CHK_546266af0fe06d6076052dbf4b_ENUM;',
        );

        await queryRunner.dropColumns('groups', [
            'current_status',
            'last_status_updated_at',
        ]);

        await queryRunner.dropColumns('group_machine_assignments', [
            'current_status',
        ]);

        await queryRunner.query(
            'ALTER TABLE machines DROP CONSTRAINT CHK_07003e3b0e80f35020f8367b94_ENUM;',
        );

        await queryRunner.dropColumns('machines', [
            'picture_url',
            'machine_manufacturer_id',
            'model_and_type',
            'serial_number',
            'serial_number_plate_picture_url',
            'current_status',
            'last_status_updated_at',
        ]);

        await queryRunner.query(
            'ALTER TABLE machine_histories DROP CONSTRAINT CHK_00b072fa6928f33a03767ce4ac_ENUM;',
        );

        await queryRunner.dropColumns('machine_histories', [
            'picture_url',
            'machine_manufacturer_id',
            'model_and_type',
            'serial_number',
            'serial_number_plate_picture_url',
            'current_status',
        ]);
    }
}
