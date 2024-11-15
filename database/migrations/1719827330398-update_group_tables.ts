import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateGroupTables1719827330398 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'groups',
            new TableColumn({
                name: 'allow_non_komatsu_info_use',
                type: 'BIT',
                default: 0,
            }),
        );

        await queryRunner.addColumn(
            'group_histories',
            new TableColumn({
                name: 'allow_non_komatsu_info_use',
                type: 'BIT',
                default: 0,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('groups', 'allow_non_komatsu_info_use');
        await queryRunner.dropColumn(
            'group_histories',
            'allow_non_komatsu_info_use',
        );
    }
}
