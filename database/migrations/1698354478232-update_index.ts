import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableIndex,
} from 'typeorm';

export class UpdateIndex1698354478232 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.query(
            'CREATE SEQUENCE user_search_id_seq AS INT START WITH 1 INCREMENT BY 1;',
        );

        await queryRunner.query(
            `ALTER TABLE users ADD CONSTRAINT DF_user_search_id DEFAULT (RIGHT('000000' + CAST(NEXT VALUE FOR user_search_id_seq AS VARCHAR(7)),7)) FOR search_id;`,
        );

        await queryRunner.query('UPDATE users SET search_id = DEFAULT;');

        await queryRunner.query(
            `ALTER TABLE users ALTER COLUMN search_id CHAR(7) NOT NULL`,
        );

        await queryRunner.query(
            'DROP INDEX IDX_97672ac88f789774dd47f7c8be ON users;',
        );

        await queryRunner.query(
            'CREATE UNIQUE INDEX IDX_f4c61ac7e035511086459abf08 ON users(mobile_phone_number) WHERE mobile_phone_number IS NOT NULL;',
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({
                columnNames: ['search_id'],
                isUnique: true,
            }),
        );

        await queryRunner.query(
            `EXEC sp_rename '[users].[name]', 'given_name', 'COLUMN';`,
        );

        //groups
        await queryRunner.query(
            'DROP INDEX IDX_ef10d4611e4f355d10ecaa10ac ON groups;',
        );

        await queryRunner.createIndex(
            'groups',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        //group_machine_assignments
        await queryRunner.query(
            `EXEC sp_rename '[group_machine_assignments].[assigned_at]', 'last_status_updated_at', 'COLUMN';`,
        );

        //group_histories
        await queryRunner.query(
            'ALTER TABLE [dbo].[group_histories] ADD CONSTRAINT DF__group_his__event DEFAULT GETDATE() FOR [event_at];',
        );

        await queryRunner.query(
            'ALTER TABLE group_histories DROP CONSTRAINT CHK_18c151c4399eb0c9d1b1b9857d_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE group_histories ADD CONSTRAINT CHK_18c151c4399eb0c9d1b1b9857d_ENUM CHECK(event_type IN ('CREATE', 'UPDATE', 'ARCHIVE', 'UNARCHIVE', 'DELETE'));`,
        );

        await queryRunner.query(
            `UPDATE group_histories SET current_status = 'CREATED';`,
        );

        await queryRunner.query(
            `ALTER TABLE group_histories ALTER COLUMN current_status VARCHAR(128) NOT NULL`,
        );

        //machine_histories
        await queryRunner.query(
            'ALTER TABLE machine_histories ALTER COLUMN event_type VARCHAR(128) NOT NULL',
        );

        //user_group_assignments
        await queryRunner.query(
            `EXEC sp_rename '[user_group_assignments].[last_active_at]', 'last_status_updated_at', 'COLUMN';`,
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignments DROP CONSTRAINT CHK_e04f1101bb04ceaa9fa38c3fc3_ENUM;',
        );

        await queryRunner.query(
            `UPDATE user_group_assignments SET current_status = 'ASSIGNED' WHERE current_status = 'USER_GROUP_ASSIGNMENT_START'`,
        );

        await queryRunner.query(
            `UPDATE user_group_assignments SET current_status = 'UNASSIGNED' WHERE current_status = 'USER_GROUP_ASSIGNMENT_END'`,
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignments ALTER COLUMN current_status VARCHAR(128) NOT NULL',
        );

        await queryRunner.query(
            `ALTER TABLE user_group_assignments ADD CONSTRAINT CHK_e04f1101bb04ceaa9fa38c3fc3_ENUM CHECK(current_status IN ('ASSIGNED', 'UNASSIGNED'));`,
        );

        //permission_translates --> permission_translations
        await queryRunner.query(
            `EXEC sp_rename 'permission_translates', 'permission_translations'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.query(
            `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")`,
        );

        await queryRunner.query(
            'ALTER TABLE users DROP CONSTRAINT DF_user_search_id;',
        );
        await queryRunner.query('DROP SEQUENCE user_search_id_seq;');

        await queryRunner.query(
            'DROP INDEX IDX_f4c61ac7e035511086459abf08 ON users;',
        );

        await queryRunner.query(
            'DROP INDEX IDX_0df4be367b0cbbef08c82f4ecb ON users;',
        );

        await queryRunner.query(
            `EXEC sp_rename '[users].[given_name]', 'name', 'COLUMN';`,
        );

        //groups
        await queryRunner.query(
            `CREATE INDEX "IDX_ef10d4611e4f355d10ecaa10ac" ON "groups" ("group_name")`,
        );

        await queryRunner.query(
            'DROP INDEX IDX_a5dbb1349d079b83781133b2b5 ON groups;',
        );

        //group_machine_assignments
        await queryRunner.query(
            `EXEC sp_rename '[group_machine_assignments].[last_status_updated_at]', 'assigned_at', 'COLUMN';`,
        );

        //group_histories
        await queryRunner.query(
            'ALTER TABLE [dbo].[group_histories] DROP CONSTRAINT DF__group_his__event;',
        );

        await queryRunner.query(
            'ALTER TABLE group_histories DROP CONSTRAINT CHK_18c151c4399eb0c9d1b1b9857d_ENUM;',
        );

        await queryRunner.query(
            `ALTER TABLE group_histories ADD CONSTRAINT CHK_18c151c4399eb0c9d1b1b9857d_ENUM CHECK(event_type IN ('CREATE', 'UPDATE', 'DELETE'));`,
        );

        await queryRunner.query(
            'ALTER TABLE group_histories DROP CONSTRAINT CHK_2c5a167cfe76bdcef2de6493b4_ENUM;',
        );

        //machine_histories
        await queryRunner.query(
            'ALTER TABLE machine_histories ALTER COLUMN event_type VARCHAR(16)',
        );

        //user_group_assignments
        await queryRunner.query(
            `EXEC sp_rename '[user_group_assignments].[last_status_updated_at]', 'last_active_at', 'COLUMN';`,
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignments DROP CONSTRAINT CHK_e04f1101bb04ceaa9fa38c3fc3_ENUM;',
        );

        await queryRunner.query(
            `UPDATE user_group_assignments SET current_status = 'USER_GROUP_ASSIGNMENT_START' WHERE current_status = 'ASSIGNED'`,
        );

        await queryRunner.query(
            `UPDATE user_group_assignments SET current_status = 'USER_GROUP_ASSIGNMENT_END' WHERE current_status = 'UNASSIGNED'`,
        );

        await queryRunner.query(
            'ALTER TABLE user_group_assignments ALTER COLUMN current_status VARCHAR(128) NOT NULL',
        );

        await queryRunner.query(
            `ALTER TABLE user_group_assignments ADD CONSTRAINT CHK_e04f1101bb04ceaa9fa38c3fc3_ENUM CHECK(current_status IN ('USER_GROUP_ASSIGNMENT_END', 'USER_GROUP_ASSIGNMENT_START'));`,
        );

        //permission_translates --> permission_translations
        await queryRunner.query(
            `EXEC sp_rename 'permission_translations', 'permission_translates'`,
        );
    }
}
