import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class UpdateTables1696903139468 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN picture_url VARCHAR(512) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN iso_locale_code VARCHAR(10) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN mobile_phone_number NVARCHAR(128) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN company_name NVARCHAR(255) NULL;',
        );

        //group_invitations
        await queryRunner.query(
            'ALTER TABLE group_invitations DROP CONSTRAINT FK_b34a201d1c2b3c433cb277cd499;',
        );

        await queryRunner.query(
            'ALTER TABLE group_invitations DROP COLUMN user_group_role_template_id;',
        );

        //user_group_assignments
        await queryRunner.query(
            'ALTER TABLE user_group_assignments DROP CONSTRAINT FK_5f000be3e9916025140ce4c5f82;',
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignments DROP COLUMN user_group_role_template_id;',
        );

        //groups
        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN start_date DATE NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN end_date DATE NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.query(
            'DELETE FROM users WHERE picture_url IS NULL OR iso_locale_code IS NULL OR mobile_phone_number IS NULL OR company_name IS NULL',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN picture_url VARCHAR(512) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN iso_locale_code VARCHAR(10) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN mobile_phone_number NVARCHAR(128) NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN company_name NVARCHAR(255) NOT NULL;',
        );

        //group_invitations
        await queryRunner.addColumn(
            'group_invitations',
            new TableColumn({
                name: 'user_group_role_template_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );

        //user_group_assignments
        await queryRunner.addColumn(
            'user_group_assignments',
            new TableColumn({
                name: 'user_group_role_template_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
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
        ];

        await createForeignKeys(foreignKeys, queryRunner);

        //groups
        await queryRunner.query(
            'DELETE FROM groups WHERE start_date IS NULL OR end_date IS NULL',
        );

        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN start_date DATE NOT NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE groups ALTER COLUMN end_date DATE NOT NULL;',
        );
    }
}
