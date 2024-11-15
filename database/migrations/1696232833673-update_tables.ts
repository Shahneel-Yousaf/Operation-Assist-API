import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableIndex,
} from 'typeorm';

export class UpdateTables1696232833673 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //group_histories
        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN assigned_company_name NVARCHAR(255) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN location NVARCHAR(255) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN group_name NVARCHAR(255) NULL;',
        );

        //users
        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN company_name NVARCHAR(255) NOT NULL;',
        );

        // user_ciam_links;
        await queryRunner.dropIndex(
            'user_ciam_links',
            'IDX_bb180b1c30cecc6874efe1f23b',
        );

        await queryRunner.dropColumn('user_ciam_links', 'sub');

        await queryRunner.addColumn(
            'user_ciam_links',
            new TableColumn({ name: 'oid', type: ' VARCHAR(255)' }),
        );

        await queryRunner.createIndex(
            'user_ciam_links',
            new TableIndex({ columnNames: ['iss', 'oid'], isUnique: true }),
        );

        //user_group_role_name_translations
        await queryRunner.query(
            'ALTER TABLE user_group_role_name_translations ALTER COLUMN role_name NVARCHAR(255) NOT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //group_histories
        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN assigned_company_name NVARCHAR(128) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN location NVARCHAR(128) NULL;',
        );

        await queryRunner.query(
            'ALTER TABLE group_histories ALTER COLUMN group_name NVARCHAR(128) NULL;',
        );

        //users
        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN company_name NVARCHAR(128) NOT NULL;',
        );

        //user_ciam_links
        await queryRunner.dropIndex(
            'user_ciam_links',
            'IDX_eb102ee3cf6584a51c693e692a',
        );

        await queryRunner.addColumn(
            'user_ciam_links',
            new TableColumn({ name: 'sub', type: ' VARCHAR(255)' }),
        );

        await queryRunner.dropColumn('user_ciam_links', 'oid');

        await queryRunner.createIndex(
            'user_ciam_links',
            new TableIndex({ columnNames: ['iss', 'sub'], isUnique: true }),
        );

        //user_group_role_name_translations
        await queryRunner.query(
            'ALTER TABLE user_group_role_name_translations ALTER COLUMN role_name NVARCHAR(128) NOT NULL;',
        );
    }
}
