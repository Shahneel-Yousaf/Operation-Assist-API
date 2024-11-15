import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMainTables1695011909747 implements MigrationInterface {
    name = 'CreateMainTables1695011909747';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create groups table
        await queryRunner.query(
            `CREATE TABLE "groups" (
                "group_id" CHAR(26) NOT NULL,
                "group_name" NVARCHAR (255) NOT NULL,
                "assigned_company_name" NVARCHAR (255) NOT NULL,
                "location" NVARCHAR (255) NOT NULL,
                "start_date" DATE NOT NULL,
                "end_date" DATE NOT NULL,
                "created_at" DATETIME2 NOT NULL,
                "updated_at" DATETIME2,
                CONSTRAINT "UQ_ef10d4611e4f355d10ecaa10ac6" UNIQUE ("group_name"),
                CONSTRAINT "PK_7cfd923277f6ef9f89b04c60436" PRIMARY KEY ("group_id")
            )`,
        );

        // Create group_name index
        await queryRunner.query(
            `CREATE INDEX "IDX_ef10d4611e4f355d10ecaa10ac" ON "groups" ("group_name")`,
        );

        // Create machine_types table
        await queryRunner.query(
            `CREATE TABLE "machine_types" (
                "machine_type_id" CHAR(26) NOT NULL,
                "machine_type_code" VARCHAR(16) NOT NULL,
                "type_name" NVARCHAR (128) NOT NULL,
                "picture_url" VARCHAR(512) NOT NULL,
                CONSTRAINT "PK_e2a196578ae4606b9727eb40ae3" PRIMARY KEY ("machine_type_id")
            )`,
        );

        // Create machine_type_code index
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_5528503249b6b3ad72f4878638" ON "machine_types" ("machine_type_code")`,
        );

        // Create operations table
        await queryRunner.query(
            `CREATE TABLE "operations" (
                "operation_id" CHAR(26) NOT NULL,
                "operation_code" VARCHAR(32) NOT NULL,
                CONSTRAINT "PK_3ccb98a1664e5858a2be2822301" PRIMARY KEY ("operation_id")
            )`,
        );

        // Create operation_code index
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_62e77b285aa39d087f996d6e4d" ON "operations" ("operation_code")`,
        );

        // Create machines table
        await queryRunner.query(
            `CREATE TABLE "machines" (
                "machine_id" CHAR(26),
                "machine_name" NVARCHAR (128) NOT NULL,
                "machine_type_id" CHAR(26) NOT NULL,
                "created_at" DATETIME2 NOT NULL,
                "updated_at" DATETIME2,
                "deleted_at" DATETIME2,
                CONSTRAINT "PK_1fdfd66684266b6724129eeb292" PRIMARY KEY ("machine_id")
            )`,
        );

        // Create permissions table
        await queryRunner.query(
            `CREATE TABLE "permissions" (
                "permission_id" CHAR(26) NOT NULL,
                "resource_id" CHAR(26) NOT NULL,
                "operation_id" CHAR(26) NOT NULL,
                CONSTRAINT "PK_1717db2235a5b169822e7f753b1" PRIMARY KEY ("permission_id")
            )`,
        );

        // Create users table
        await queryRunner.query(
            `CREATE TABLE "users" (
                "user_id" CHAR(26) NOT NULL,
                "name" NVARCHAR (128) NOT NULL,
                "picture_url" VARCHAR(512) NOT NULL,
                "email" VARCHAR(320) NOT NULL,
                "registered_at" DATETIME2 NOT NULL CONSTRAINT "DF_c08928aeeb7a422f05087617406" DEFAULT getdate(),
                "iso_locale_code" VARCHAR(10) CONSTRAINT CHK_3c4776a86141a7df4e4ed586a5_ENUM CHECK (
                    iso_locale_code IN('en-US', 'es-CL', 'ja')
                ) NOT NULL CONSTRAINT "DF_79e90c2c1f7516bbf60e1e71b36" DEFAULT 'en-US',
                "mobile_phone_number" NVARCHAR (128) NOT NULL,
                "company_name" NVARCHAR (128) NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id")
            )`,
        );

        // Create name index
        await queryRunner.query(
            `CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name")`,
        );

        // Create email index
        await queryRunner.query(
            `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")`,
        );

        // Create permission_translates table
        await queryRunner.query(
            `CREATE TABLE "permission_translates" (
                "permission_id" CHAR(26) NOT NULL,
                "iso_locale_code" VARCHAR(10) CONSTRAINT CHK_d6259c80c4a13319823297828d_ENUM CHECK (
                    iso_locale_code IN('en-US', 'es-CL', 'ja')
                ) NOT NULL CONSTRAINT "DF_93afe022c0ee2ca86fc59738d2f" DEFAULT 'en-US',
                "permission_name" NVARCHAR (128) NOT NULL,
                CONSTRAINT "PK_a18a3ae29ca666081f4e06b13d4" PRIMARY KEY ("permission_id", "iso_locale_code")
            )`,
        );

        // Create resources table
        await queryRunner.query(
            `CREATE TABLE "resources" (
                "resource_id" CHAR(26) NOT NULL,
                "resource_code" VARCHAR(32) NOT NULL,
                CONSTRAINT "PK_b9fa5542581d6107e9bf2f49ac0" PRIMARY KEY ("resource_id")
            )`,
        );

        // Create resource_code index
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_86fa83a0d496c2d4c0bebb304e" ON "resources" ("resource_code")`,
        );

        // Create user_group_assignments table
        await queryRunner.query(
            `CREATE TABLE "user_group_assignments" (
                "user_id" CHAR(26) NOT NULL, 
                "group_id" CHAR(26) NOT NULL, 
                "last_active_at" DATETIME2 NOT NULL, 
                "current_status" VARCHAR(255) CONSTRAINT CHK_e04f1101bb04ceaa9fa38c3fc3_ENUM CHECK (
                    current_status IN('USER_GROUP_ASSIGNMENT_START', 'USER_GROUP_ASSIGNMENT_END')
                ) NOT NULL,
                "user_group_role_template_id" CHAR(26) NOT NULL,
                "user_group_role_name" NVARCHAR (255) NOT NULL,
                CONSTRAINT "PK_2a9bbb033372b778b5f7d99d74d" PRIMARY KEY ("user_id", "group_id")
            )`,
        );

        // Create user_group_permission_assignments table
        await queryRunner.query(
            `CREATE TABLE "user_group_permission_assignments" (
                "user_id" CHAR(26) NOT NULL,
                "group_id" CHAR(26) NOT NULL,
                "permission_id" CHAR(26) NOT NULL,
                "assigned_at" DATETIME2 NOT NULL,
                CONSTRAINT "PK_46b6ecc7dce247beef8949947cd" PRIMARY KEY ("user_id", "group_id", "permission_id")
            )`,
        );

        // Create user_group_role_name_translations table
        await queryRunner.query(
            `CREATE TABLE "user_group_role_name_translations" (
                "user_group_role_template_id" CHAR(26) NOT NULL,
                "iso_locale_code" VARCHAR(10) CONSTRAINT CHK_8cceb31bfe9a438c86174ab903_ENUM CHECK (
                    iso_locale_code IN('en-US', 'es-CL', 'ja')
                ) NOT NULL CONSTRAINT "DF_f67d0c4c8d142f5cc45adbeb700" DEFAULT 'en-US',
                "role_name" NVARCHAR (255) NOT NULL,
                CONSTRAINT "PK_b3361b6832d765b301b02079ea5" PRIMARY KEY ("user_group_role_template_id", "iso_locale_code")
            )`,
        );

        // Create user_group_role_templates table
        await queryRunner.query(
            `CREATE TABLE "user_group_role_templates" (
                "user_group_role_template_id" CHAR(26) NOT NULL,
                "role_code" VARCHAR(16) NOT NULL,
                "is_admin" bit NOT NULL,
                CONSTRAINT "PK_2e86cc7502acffa398c31e8bc99" PRIMARY KEY ("user_group_role_template_id")
            )`,
        );

        // Create role_code index
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_feb489926485f97dfb959d0c72" ON "user_group_role_templates" ("role_code")`,
        );

        // Create user_group_role_template_permission_assignments table
        await queryRunner.query(
            `CREATE TABLE "user_group_role_template_permission_assignments" (
                "permission_id" CHAR(26) NOT NULL, 
                "user_group_role_template_id" CHAR(26) NOT NULL, 
                "assigned_at" DATETIME2 NOT NULL, 
                CONSTRAINT "PK_feedecdc4f901d323b0519f2da7" PRIMARY KEY ("permission_id", "user_group_role_template_id")
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "user_group_role_template_permission_assignments"`,
        );
        await queryRunner.query(
            `DROP INDEX "IDX_feb489926485f97dfb959d0c72" ON "user_group_role_templates"`,
        );
        await queryRunner.query(`DROP TABLE "user_group_role_templates"`);
        await queryRunner.query(
            `DROP TABLE "user_group_role_name_translations"`,
        );
        await queryRunner.query(
            `DROP TABLE "user_group_permission_assignments"`,
        );
        await queryRunner.query(`DROP TABLE "user_group_assignments"`);
        await queryRunner.query(
            `DROP INDEX "IDX_86fa83a0d496c2d4c0bebb304e" ON "resources"`,
        );
        await queryRunner.query(`DROP TABLE "resources"`);
        await queryRunner.query(`DROP TABLE "permission_translates"`);
        await queryRunner.query(
            `DROP INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"`,
        );
        await queryRunner.query(
            `DROP INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users"`,
        );
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "machines"`);
        await queryRunner.query(
            `DROP INDEX "IDX_62e77b285aa39d087f996d6e4d" ON "operations"`,
        );
        await queryRunner.query(`DROP TABLE "operations"`);
        await queryRunner.query(
            `DROP INDEX "IDX_5528503249b6b3ad72f4878638" ON "machine_types"`,
        );
        await queryRunner.query(`DROP TABLE "machine_types"`);
        await queryRunner.query(
            `DROP INDEX "IDX_ef10d4611e4f355d10ecaa10ac" ON "groups"`,
        );
        await queryRunner.query(`DROP TABLE "groups"`);
    }
}
