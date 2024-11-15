import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationTables1695019655220 implements MigrationInterface {
    name = 'CreateRelationTables1695019655220';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create group_invitations table
        await queryRunner.query(
            `CREATE TABLE "group_invitations" (
                "group_invitation_id" CHAR(26) NOT NULL,
                "group_id" CHAR(26) NOT NULL,
                "inviter_user_id" CHAR(26) NOT NULL,
                "invited_at" DATETIME2 NOT NULL CONSTRAINT "DF_1bfb275b30f2d7f8d18e0382c1c" DEFAULT getdate(),
                "invitation_type" VARCHAR(32) CONSTRAINT CHK_99c8edd4d1c044c267708a05a5_ENUM CHECK(
                  invitation_type IN ('EMAIL_INVITE', 'EXISTING_USER_INVITE')
                ) NOT NULL,
                "invitee_user_id" CHAR(26),
                "invitee_email" VARCHAR(255),
                "invitee_name" NVARCHAR(128),
                "user_group_role_template_id" CHAR(26) NOT NULL,
                "user_group_role_name" NVARCHAR(255) NOT NULL,
                "responded_at" DATETIME2,
                "invitation_response" VARCHAR(16) CONSTRAINT CHK_cb05944c10ae56aacca72c61cd_ENUM CHECK(invitation_response IN ('accepted', 'declined')),
                CONSTRAINT "PK_a123541cc674f66e2bceff45dd2" PRIMARY KEY ("group_invitation_id")
            )`,
        );

        // Create group_machine_assignments table
        await queryRunner.query(
            `CREATE TABLE "group_machine_assignments" (
                "group_id" CHAR(26) NOT NULL,
                "machine_id" CHAR(26) NOT NULL,
                "assigned_at" DATETIME2 NOT NULL,
                CONSTRAINT "PK_782e779eb1d3f47175d70fcd9ed" PRIMARY KEY ("group_id", "machine_id")
            )`,
        );

        // Create machine_histories table
        await queryRunner.query(
            `CREATE TABLE "machine_histories" (
                "machine_history_id" CHAR(26) NOT NULL,
                "event_type" VARCHAR(16) CONSTRAINT CHK_5cc359f4a34b3042fe412b6cb7_ENUM CHECK(event_type IN ('CREATE', 'UPDATE', 'DELETE')) NOT NULL,
                "event_at" DATETIME2 NOT NULL CONSTRAINT "DF_d714ee9e8c11d913b79066e8a50" DEFAULT getdate(),
                "actioned_by_user_id" CHAR(26) NOT NULL,
                "machine_id" CHAR(26) NOT NULL,
                "machine_name" NVARCHAR(128),
                "machine_type_id" CHAR(26),
                CONSTRAINT "PK_d9e1c05bb24df252418ea229095" PRIMARY KEY ("machine_history_id")
            )`,
        );

        // Create group_histories table
        await queryRunner.query(
            `CREATE TABLE "group_histories" (
                "group_history_id" CHAR(26) NOT NULL,
                "event_type" VARCHAR(16) CONSTRAINT CHK_18c151c4399eb0c9d1b1b9857d_ENUM CHECK(event_type IN ('CREATE', 'UPDATE', 'DELETE')) NOT NULL,
                "event_at" DATETIME2 NOT NULL,
                "actioned_by_user_id" CHAR(26) NOT NULL,
                "group_id" CHAR(26) NOT NULL,
                "group_name" NVARCHAR(128),
                "assigned_company_name" NVARCHAR(128),
                "location" NVARCHAR(128),
                "start_date" DATE,
                "end_date" DATE,
                CONSTRAINT "PK_fa5e4eda6b68981f90b4e3c38fe" PRIMARY KEY ("group_history_id")
            )`,
        );

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

        // Create user_group_permission_invitations table
        await queryRunner.query(
            `CREATE TABLE "user_group_permission_invitations" (
                "permission_id" CHAR(26) NOT NULL,
                "group_invitation_id" CHAR(26) NOT NULL,
                "invited_at" DATETIME2 NOT NULL,
                CONSTRAINT "PK_0307ac128d7fb6b3d1ba6938d2e" PRIMARY KEY ("permission_id", "group_invitation_id")
            )`,
        );

        // Create user_ciam_links table
        await queryRunner.query(
            `CREATE TABLE "user_ciam_links" (
                "user_ciam_link_id" CHAR(26) NOT NULL,
                "user_id" CHAR(26) NOT NULL,
                "sub" VARCHAR(255) NOT NULL,
                "iss" VARCHAR(512) NOT NULL,
                "linked_at" DATETIME2 NOT NULL,
                CONSTRAINT "PK_47650df7d7373d061f738f9cd7f" PRIMARY KEY ("user_ciam_link_id")
            )`,
        );

        // Create sub, iss index
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_bb180b1c30cecc6874efe1f23b" ON "user_ciam_links" ("sub", "iss")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX "IDX_bb180b1c30cecc6874efe1f23b" ON "user_ciam_links"`,
        );
        await queryRunner.query(`DROP TABLE "user_ciam_links"`);
        await queryRunner.query(
            `DROP TABLE "user_group_permission_invitations"`,
        );
        await queryRunner.query(`DROP TABLE "machine_notes"`);
        await queryRunner.query(`DROP TABLE "machine_note_histories"`);
        await queryRunner.query(`DROP TABLE "group_histories"`);
        await queryRunner.query(`DROP TABLE "machine_histories"`);
        await queryRunner.query(`DROP TABLE "group_machine_assignments"`);
        await queryRunner.query(`DROP TABLE "group_invitations"`);
    }
}
