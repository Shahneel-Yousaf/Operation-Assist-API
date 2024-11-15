import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateNotificationsTable1706759330644
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('notifications', ['retry_count','retry_after_sec']);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('notifications', [
            new TableColumn({
                name: 'retry_count',
                type: 'INT',
                default: 0,
            }),
            new TableColumn({
                name: 'retry_after_sec',
                type: 'INT',
                default: 60,
            }),
        ]);
    }
}
