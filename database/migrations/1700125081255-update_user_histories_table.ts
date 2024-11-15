import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableIndex,
} from 'typeorm';

export class UpdateUserHistoriesTable1700125081255
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //user_histories
        await queryRunner.query(
            `EXEC sp_rename '[user_histories].[name]', 'given_name', 'COLUMN';`,
        );

        await queryRunner.addColumn(
            'user_histories',
            new TableColumn({
                name: 'surname',
                type: 'NVARCHAR',
                length: '128',
                isNullable: true,
            }),
        );

        await queryRunner.query(
            `UPDATE user_histories SET given_name = 'given name' WHERE given_name IS NULL;`,
        );

        await queryRunner.query(
            `UPDATE user_histories SET surname = 'surname' WHERE surname IS NULL;`,
        );

        await queryRunner.query(
            `ALTER TABLE user_histories ALTER COLUMN given_name NVARCHAR(128) NOT NULL`,
        );

        await queryRunner.query(
            `ALTER TABLE user_histories ALTER COLUMN surname NVARCHAR(128) NOT NULL`,
        );

        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['given_name'] }),
        );
        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['surname'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //user_histories
        await queryRunner.query(
            `EXEC sp_rename '[user_histories].[given_name]', 'name', 'COLUMN';`,
        );

        await queryRunner.query(
            `ALTER TABLE user_histories ALTER COLUMN name NVARCHAR(128) NULL`,
        );

        await queryRunner.dropIndex(
            'user_histories',
            'IDX_f49f3cd73db8f7acce2dab8584',
        );
        await queryRunner.dropIndex(
            'user_histories',
            'IDX_82f4d04ada8f77de8daef7cf94',
        );

        await queryRunner.dropColumn('user_histories', 'surname');
    }
}
