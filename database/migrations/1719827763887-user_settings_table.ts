import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserSettingsTable1719827763887 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user_settings',
            new TableColumn({
                name: 'suppress_data_usage_popup',
                type: 'BIT',
                default: 0,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            'user_settings',
            'suppress_data_usage_popup',
        );
    }
}
