import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserGroupAssignmentHistoriesTable1704250985090
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user_group_assignment_histories',
            new TableColumn({ name: 'is_admin', type: 'BIT', default: 0 }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            'user_group_assignment_histories',
            'is_admin',
        );
    }
}
