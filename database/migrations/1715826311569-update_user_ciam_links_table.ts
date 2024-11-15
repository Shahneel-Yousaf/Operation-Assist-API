import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserCiamLinksTable1715826311569
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE [dbo].[user_ciam_links] ADD [ciam_email] varchar(320) NOT NULL DEFAULT ''`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE user_ciam_links DROP CONSTRAINT DF__user_ciam__ciam___0E04126B;',
        );

        await queryRunner.dropColumn('user_ciam_links', 'ciam_email');
    }
}
