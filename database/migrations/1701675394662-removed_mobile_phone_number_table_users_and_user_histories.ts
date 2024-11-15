import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemovedMobilePhoneNumberTableUsersAndUserHistories1701675394662
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user_histories DROP COLUMN mobile_phone_number;
        `);

        await queryRunner.query(`
            DROP INDEX IDX_f4c61ac7e035511086459abf08 ON users;
        `);

        await queryRunner.query(`
            ALTER TABLE users DROP COLUMN mobile_phone_number;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user_histories',
            new TableColumn({
                name: 'mobile_phone_number',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
        );
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'mobile_phone_number',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
        );
        await queryRunner.query(`
            CREATE UNIQUE NONCLUSTERED INDEX IDX_f4c61ac7e035511086459abf08
            ON dbo.users(mobile_phone_number)
            WHERE mobile_phone_number IS NOT NULL;
        `);
    }
}
