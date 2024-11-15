import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateUserSettingsTable1704708354283
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user_settings table
        await queryRunner.createTable(
            new Table({
                name: 'user_settings',
                columns: [
                    new TableColumn({
                        name: 'user_id',
                        type: 'CHAR',
                        length: '26',
                        isPrimary: true,
                    }),
                    new TableColumn({
                        name: 'report_notification',
                        type: 'BIT',
                        default: 1,
                    }),
                    new TableColumn({
                        name: 'inspection_notification',
                        type: 'BIT',
                        default: 1,
                    }),
                ],
            }),
            true,
        );

        await queryRunner.query(`
            INSERT INTO user_settings (user_id)
            SELECT users.user_id
            FROM users;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_settings', true, true, true);
    }
}
