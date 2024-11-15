import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIsoLocaleCode1712118756676 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // users
        await queryRunner.query(
            `ALTER TABLE users DROP CONSTRAINT CHK_3c4776a86141a7df4e4ed586a5_ENUM;`,
        );
        await queryRunner.query(
            `ALTER TABLE users DROP CONSTRAINT DF_79e90c2c1f7516bbf60e1e71b36;`,
        );
        await queryRunner.query(
            `UPDATE users SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE users SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE users ADD CONSTRAINT CHK_3c4776a86141a7df4e4ed586a5_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE users ADD CONSTRAINT DF_79e90c2c1f7516bbf60e1e71b36 DEFAULT 'en' FOR iso_locale_code;`,
        );

        // permission_translations
        await queryRunner.query(
            'ALTER TABLE permission_translations DROP CONSTRAINT CHK_d6259c80c4a13319823297828d_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE permission_translations DROP CONSTRAINT DF_93afe022c0ee2ca86fc59738d2f;`,
        );
        await queryRunner.query(
            `UPDATE permission_translations SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE permission_translations SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE permission_translations ADD CONSTRAINT CHK_d6259c80c4a13319823297828d_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE permission_translations ADD CONSTRAINT DF_93afe022c0ee2ca86fc59738d2f DEFAULT 'en' FOR iso_locale_code;`,
        );

        // user_group_role_name_translations
        await queryRunner.query(
            'ALTER TABLE user_group_role_name_translations DROP CONSTRAINT CHK_8cceb31bfe9a438c86174ab903_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE user_group_role_name_translations DROP CONSTRAINT DF_f67d0c4c8d142f5cc45adbeb700;`,
        );
        await queryRunner.query(
            `UPDATE user_group_role_name_translations SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE user_group_role_name_translations SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE user_group_role_name_translations ADD CONSTRAINT CHK_8cceb31bfe9a438c86174ab903_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE user_group_role_name_translations ADD CONSTRAINT DF_f67d0c4c8d142f5cc45adbeb700 DEFAULT 'en' FOR iso_locale_code;`,
        );

        // machine_type_translations
        await queryRunner.query(
            'ALTER TABLE machine_type_translations DROP CONSTRAINT CHK_ba489bb78a57a3a04b230273d0_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE machine_type_translations DROP CONSTRAINT DF_952fcb484e5addf46bc6afa439c;`,
        );
        await queryRunner.query(
            `UPDATE machine_type_translations SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE machine_type_translations SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE machine_type_translations ADD CONSTRAINT CHK_ba489bb78a57a3a04b230273d0_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE machine_type_translations ADD CONSTRAINT DF_952fcb484e5addf46bc6afa439c DEFAULT 'en' FOR iso_locale_code;`,
        );

        // report_action_choice_translations
        await queryRunner.query(
            'ALTER TABLE report_action_choice_translations DROP CONSTRAINT CHK_cdc8d7492560fdac92fc75eed9_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE report_action_choice_translations DROP CONSTRAINT DF_4d712fe14dd8208bd98a0334acb;`,
        );
        await queryRunner.query(
            `UPDATE report_action_choice_translations SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE report_action_choice_translations SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE report_action_choice_translations ADD CONSTRAINT CHK_cdc8d7492560fdac92fc75eed9_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE report_action_choice_translations ADD CONSTRAINT DF_4d712fe14dd8208bd98a0334acb DEFAULT 'en' FOR iso_locale_code;`,
        );

        // inspection_form_template_translations
        await queryRunner.query(
            'ALTER TABLE inspection_form_template_translations DROP CONSTRAINT CHK_396f0d6063eb50e9f62d246355_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE inspection_form_template_translations DROP CONSTRAINT DF_2f01415f422fb2e385fe8ebaebe;`,
        );
        await queryRunner.query(
            `UPDATE inspection_form_template_translations SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE inspection_form_template_translations SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_form_template_translations ADD CONSTRAINT CHK_396f0d6063eb50e9f62d246355_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_form_template_translations ADD CONSTRAINT DF_2f01415f422fb2e385fe8ebaebe DEFAULT 'en' FOR iso_locale_code;`,
        );

        // inspection_item_template_translations
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations DROP CONSTRAINT CHK_2aa62947fa0abc483e2f0ff410_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE inspection_item_template_translations DROP CONSTRAINT DF_170264543afeb6fe97708387cf5;`,
        );
        await queryRunner.query(
            `UPDATE inspection_item_template_translations SET iso_locale_code = 'en' WHERE iso_locale_code = 'en-US';`,
        );
        await queryRunner.query(
            `UPDATE inspection_item_template_translations SET iso_locale_code = 'es' WHERE iso_locale_code = 'es-CL';`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_item_template_translations ADD CONSTRAINT CHK_2aa62947fa0abc483e2f0ff410_ENUM CHECK (iso_locale_code IN('ja', 'en', 'es', 'pt', 'ar', 'ur'))`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_item_template_translations ADD CONSTRAINT DF_170264543afeb6fe97708387cf5 DEFAULT 'en' FOR iso_locale_code;`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // users
        await queryRunner.query(
            'ALTER TABLE users DROP CONSTRAINT CHK_3c4776a86141a7df4e4ed586a5_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE users DROP CONSTRAINT DF_79e90c2c1f7516bbf60e1e71b36;`,
        );
        await queryRunner.query(
            `UPDATE users SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE users SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE users ADD CONSTRAINT CHK_3c4776a86141a7df4e4ed586a5_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE users ADD CONSTRAINT DF_79e90c2c1f7516bbf60e1e71b36 DEFAULT 'en-US' FOR iso_locale_code;`,
        );

        // permission_translations
        await queryRunner.query(
            'ALTER TABLE permission_translations DROP CONSTRAINT CHK_d6259c80c4a13319823297828d_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE permission_translations DROP CONSTRAINT DF_93afe022c0ee2ca86fc59738d2f;`,
        );
        await queryRunner.query(
            `UPDATE permission_translations SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE permission_translations SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE permission_translations ADD CONSTRAINT CHK_d6259c80c4a13319823297828d_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE permission_translations ADD CONSTRAINT DF_93afe022c0ee2ca86fc59738d2f DEFAULT 'en-US' FOR iso_locale_code;`,
        );

        // user_group_role_name_translations
        await queryRunner.query(
            'ALTER TABLE user_group_role_name_translations DROP CONSTRAINT CHK_8cceb31bfe9a438c86174ab903_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE user_group_role_name_translations DROP CONSTRAINT DF_f67d0c4c8d142f5cc45adbeb700;`,
        );
        await queryRunner.query(
            `UPDATE user_group_role_name_translations SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE user_group_role_name_translations SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE user_group_role_name_translations ADD CONSTRAINT CHK_8cceb31bfe9a438c86174ab903_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE user_group_role_name_translations ADD CONSTRAINT DF_f67d0c4c8d142f5cc45adbeb700 DEFAULT 'en-US' FOR iso_locale_code;`,
        );

        // machine_type_translations
        await queryRunner.query(
            'ALTER TABLE machine_type_translations DROP CONSTRAINT CHK_ba489bb78a57a3a04b230273d0_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE machine_type_translations DROP CONSTRAINT DF_952fcb484e5addf46bc6afa439c;`,
        );
        await queryRunner.query(
            `UPDATE machine_type_translations SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE machine_type_translations SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE machine_type_translations ADD CONSTRAINT CHK_ba489bb78a57a3a04b230273d0_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE machine_type_translations ADD CONSTRAINT DF_952fcb484e5addf46bc6afa439c DEFAULT 'en-US' FOR iso_locale_code;`,
        );

        // report_action_choice_translations
        await queryRunner.query(
            'ALTER TABLE report_action_choice_translations DROP CONSTRAINT CHK_cdc8d7492560fdac92fc75eed9_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE report_action_choice_translations DROP CONSTRAINT DF_4d712fe14dd8208bd98a0334acb;`,
        );
        await queryRunner.query(
            `UPDATE report_action_choice_translations SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE report_action_choice_translations SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE report_action_choice_translations ADD CONSTRAINT CHK_cdc8d7492560fdac92fc75eed9_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE report_action_choice_translations ADD CONSTRAINT DF_4d712fe14dd8208bd98a0334acb DEFAULT 'en-US' FOR iso_locale_code;`,
        );

        // inspection_form_template_translations
        await queryRunner.query(
            'ALTER TABLE inspection_form_template_translations DROP CONSTRAINT CHK_396f0d6063eb50e9f62d246355_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE inspection_form_template_translations DROP CONSTRAINT DF_2f01415f422fb2e385fe8ebaebe;`,
        );
        await queryRunner.query(
            `UPDATE inspection_form_template_translations SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE inspection_form_template_translations SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_form_template_translations ADD CONSTRAINT CHK_396f0d6063eb50e9f62d246355_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_form_template_translations ADD CONSTRAINT DF_2f01415f422fb2e385fe8ebaebe DEFAULT 'en-US' FOR iso_locale_code;`,
        );

        // inspection_item_template_translations
        await queryRunner.query(
            'ALTER TABLE inspection_item_template_translations DROP CONSTRAINT CHK_2aa62947fa0abc483e2f0ff410_ENUM;',
        );
        await queryRunner.query(
            `ALTER TABLE inspection_item_template_translations DROP CONSTRAINT DF_170264543afeb6fe97708387cf5;`,
        );
        await queryRunner.query(
            `UPDATE inspection_item_template_translations SET iso_locale_code = 'en-US' WHERE iso_locale_code = 'en';`,
        );
        await queryRunner.query(
            `UPDATE inspection_item_template_translations SET iso_locale_code = 'es-CL' WHERE iso_locale_code = 'es';`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_item_template_translations ADD CONSTRAINT CHK_2aa62947fa0abc483e2f0ff410_ENUM CHECK (iso_locale_code IN('en-US', 'es-CL', 'ja'))`,
        );
        await queryRunner.query(
            `ALTER TABLE inspection_item_template_translations ADD CONSTRAINT DF_170264543afeb6fe97708387cf5 DEFAULT 'en-US' FOR iso_locale_code;`,
        );
    }
}
