import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DropColumns1698427425309 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.dropColumns('users', ['company_name']);

        //groups
        await queryRunner.dropColumns('groups', [
            'assigned_company_name',
            'start_date',
            'end_date',
            'created_at',
            'updated_at',
        ]);

        //machines
        await queryRunner.dropColumns('machines', [
            'created_at',
            'updated_at',
            'deleted_at',
        ]);

        //group_histories
        await queryRunner.dropColumns('group_histories', [
            'start_date',
            'end_date',
            'assigned_company_name',
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //users
        await queryRunner.addColumns('users', [
            new TableColumn({
                name: 'company_name',
                type: 'NVARCHAR',
                length: '128',
                isNullable: true,
            }),
        ]);

        //groups
        await queryRunner.addColumns('groups', [
            new TableColumn({
                name: 'assigned_company_name',
                type: 'NVARCHAR',
                length: '255',
                isNullable: true,
            }),
            new TableColumn({
                name: 'start_date',
                type: 'DATE',
                isNullable: true,
            }),
            new TableColumn({
                name: 'end_date',
                type: 'DATE',
                isNullable: true,
            }),
            new TableColumn({
                name: 'created_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
        ]);

        //machines
        await queryRunner.addColumns('machines', [
            new TableColumn({
                name: 'created_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
            new TableColumn({
                name: 'updated_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
            new TableColumn({
                name: 'deleted_at',
                type: 'DATETIME2',
                isNullable: true,
            }),
        ]);

        //group_histories
        await queryRunner.addColumns('group_histories', [
            new TableColumn({
                name: 'assigned_company_name',
                type: 'NVARCHAR(128)',
                isNullable: true,
            }),
            new TableColumn({
                name: 'start_date',
                type: 'DATE',
                isNullable: true,
            }),
            new TableColumn({
                name: 'end_date',
                type: 'DATE',
                isNullable: true,
            }),
        ]);
    }
}
