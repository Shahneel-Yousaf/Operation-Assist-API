import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedUniqueGroupNameTableGroups1701761528254
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE groups DROP CONSTRAINT UQ_ef10d4611e4f355d10ecaa10ac6;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE groups
            ADD CONSTRAINT UQ_ef10d4611e4f355d10ecaa10ac6 UNIQUE (group_name);
        `);
    }
}
