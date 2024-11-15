import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys } from '../commons/functions';

export class DropTables1698226572038 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //machine_note_histories
        await queryRunner.dropTable('machine_note_histories', true, true);

        //machine_notes
        await queryRunner.dropTable('machine_notes', true, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Create machine_note_histories table
        await queryRunner.query(
            `CREATE TABLE "machine_note_histories" (
                "machine_note_history_id" CHAR(26) NOT NULL,
                "machine_note_id" CHAR(26) NOT NULL,
                "event_type" VARCHAR(16) CONSTRAINT CHK_c8bc9e8b997e89b75bc9971706_ENUM CHECK(event_type IN ('CREATE', 'UPDATE', 'DELETE')) NOT NULL,
                "event_at" DATETIME2 NOT NULL,
                "actioned_by_user_id" CHAR(26) NOT NULL,
                "machine_note" VARCHAR(MAX),
                CONSTRAINT "PK_5562aba4195e057a32635699fc4" PRIMARY KEY ("machine_note_history_id")
            )`,
        );

        // Create machine_notes table
        await queryRunner.query(
            `CREATE TABLE "machine_notes" (
                "machine_note_id" CHAR(26) NOT NULL,
                "machine_id" CHAR(26) NOT NULL,
                "machine_note" VARCHAR(MAX) NOT NULL,
                "created_at" DATETIME2 NOT NULL,
                "updated_at" DATETIME2,
                CONSTRAINT "PK_3269f2a9ef6a3e0c7bf37bbe60a" PRIMARY KEY ("machine_note_id")
            )`,
        );

        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            // machine_note_histories
            {
                keys: [
                    ['machine_note_id', 'machine_note_id', 'machine_notes'],
                    ['actioned_by_user_id', 'user_id', 'users'],
                ],
                table: 'machine_note_histories',
            },
            //machine_notes
            {
                keys: [['machine_id', 'machine_id', 'machines']],
                table: 'machine_notes',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }
}
