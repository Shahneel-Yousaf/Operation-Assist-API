import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class UpdateUsersTable1700724286123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // delete function generate previous default value
        await queryRunner.query(
            'ALTER TABLE users DROP CONSTRAINT DF_user_search_id;',
        );

        await queryRunner.query('DROP SEQUENCE user_search_id_seq;');

        // delete previous index 
        await queryRunner.query(
            `DROP INDEX "IDX_0df4be367b0cbbef08c82f4ecb" ON "users"`,
        );

        // update data type to 9 charactors
        await queryRunner.query(
            `ALTER TABLE users ALTER COLUMN search_id CHAR(9) NOT NULL`,
        );

        await queryRunner.query(
            `UPDATE users SET search_id = '00' + search_id WHERE LEN(search_id) = 7;`,
        );

        // create index for search_id
        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['search_id'], isUnique: true }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE SEQUENCE user_search_id_seq AS INT START WITH 1 INCREMENT BY 1;',
        );

        await queryRunner.query(
            `ALTER TABLE users ADD CONSTRAINT DF_user_search_id DEFAULT (RIGHT('000000' + CAST(NEXT VALUE FOR user_search_id_seq AS VARCHAR(7)),7)) FOR search_id;`,
        );

        await queryRunner.query(
            `DROP INDEX "IDX_0df4be367b0cbbef08c82f4ecb" ON "users"`,
        );

        await queryRunner.query('UPDATE users SET search_id = DEFAULT;');

        await queryRunner.query(
            `ALTER TABLE users ALTER COLUMN search_id CHAR(7) NOT NULL`,
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['search_id'], isUnique: true }),
        );
    }
}
