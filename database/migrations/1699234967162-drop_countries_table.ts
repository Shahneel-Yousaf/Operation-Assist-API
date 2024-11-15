import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class DropCountriesTable1699234967162 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.query(
            'ALTER TABLE users DROP CONSTRAINT FK_864f434694533429f55d71abd35;',
        );

        await queryRunner.dropColumn('users', 'country_of_residence_id');
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'residence_country_code',
                type: 'CHAR',
                length: '2',
                isNullable: true,
            }),
        );
        await queryRunner.query(
            `UPDATE users SET residence_country_code = 'JA';`,
        );

        await queryRunner.query(
            'ALTER TABLE users ALTER COLUMN residence_country_code CHAR(2) NOT NULL;',
        );

        //countries
        await queryRunner.dropTable('countries', true, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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

        //users
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'country_of_residence_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );
        await queryRunner.dropColumn('users', 'residence_country_code');
        await queryRunner.query(
            'ALTER TABLE users ADD CONSTRAINT FK_864f434694533429f55d71abd35 FOREIGN KEY ([country_of_residence_id]) REFERENCES countries ([country_id]);',
        );
    }
}
