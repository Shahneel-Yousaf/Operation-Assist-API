import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserGroupAssignmentsTable1704250347782
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user_group_assignments',
            new TableColumn({ name: 'is_admin', type: 'BIT', default: 0 }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user_group_assignments', 'is_admin');
    }
}
