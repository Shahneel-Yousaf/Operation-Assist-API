import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateGroupTable1705291661657 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // groups
        await queryRunner.addColumn(
            'groups',
            new TableColumn({
                name: 'company_name',
                type: 'NVARCHAR',
                length: '255',
                default: `''`,
            }),
        );

        await queryRunner.query(
            'ALTER TABLE groups DROP CONSTRAINT DF_d14c1bf93401ab5e66fa6b5af9a;',
        );

        // group_histories
        await queryRunner.addColumn(
            'group_histories',
            new TableColumn({
                name: 'company_name',
                type: 'NVARCHAR',
                length: '255',
                default: `''`,
            }),
        );

        await queryRunner.query(
            'ALTER TABLE group_histories DROP CONSTRAINT DF_c7ee7819a97ed8ae6fcc21ab3ac;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // groups
        await queryRunner.dropColumn('groups', 'company_name');

        // group_histories
        await queryRunner.dropColumn('group_histories', 'company_name');
    }
}
