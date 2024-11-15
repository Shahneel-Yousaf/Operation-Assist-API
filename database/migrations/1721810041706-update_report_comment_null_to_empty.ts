import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateReportCommentNullToEmpty1721810041706
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE machine_report_responses SET report_comment = '' WHERE report_comment IS NULL;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
