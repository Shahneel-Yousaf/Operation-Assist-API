import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexForCurrentStatus1710303703757
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //custom_inspection_form_histories
        await queryRunner.createIndex(
            'custom_inspection_form_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        ////custom_inspection_item_histories
        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({ columnNames: ['item_code'] }),
        );

        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({ columnNames: ['position'] }),
        );

        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        //custom_inspection_items
        await queryRunner.createIndex(
            'custom_inspection_items',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'custom_inspection_items',
            new TableIndex({ columnNames: ['position'] }),
        );

        await queryRunner.createIndex(
            'custom_inspection_items',
            new TableIndex({ columnNames: ['item_code'] }),
        );

        //devices
        await queryRunner.createIndex(
            'devices',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        //group_histories
        await queryRunner.createIndex(
            'group_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'group_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        //inspection_form_template_translations
        await queryRunner.createIndex(
            'inspection_form_template_translations',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //inspection_histories
        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        //inspection_item_template_translations
        await queryRunner.createIndex(
            'inspection_item_template_translations',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //inspection_item_templates
        await queryRunner.createIndex(
            'inspection_item_templates',
            new TableIndex({ columnNames: ['position'] }),
        );

        await queryRunner.createIndex(
            'inspection_item_templates',
            new TableIndex({ columnNames: ['item_code'] }),
        );

        //inspection_result_histories
        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['item_code'] }),
        );

        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['result'] }),
        );

        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        //inspection_results
        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['item_code'] }),
        );

        //inspections
        await queryRunner.createIndex(
            'inspections',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'inspections',
            new TableIndex({ columnNames: ['last_status_updated_at'] }),
        );

        //machine_condition_histories
        await queryRunner.createIndex(
            'machine_condition_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        await queryRunner.createIndex(
            'machine_condition_histories',
            new TableIndex({ columnNames: ['machine_condition'] }),
        );

        //machine_histories
        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['model_and_type'] }),
        );

        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['serial_number'] }),
        );

        //machine_report_histories
        await queryRunner.createIndex(
            'machine_report_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'machine_report_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        //machine_report_responses
        await queryRunner.createIndex(
            'machine_report_responses',
            new TableIndex({ columnNames: ['status'] }),
        );

        await queryRunner.createIndex(
            'machine_report_responses',
            new TableIndex({ columnNames: ['commented_at'] }),
        );

        //machine_type_translations
        await queryRunner.createIndex(
            'machine_type_translations',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //machines
        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['model_and_type'] }),
        );

        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['serial_number'] }),
        );

        //permission_translations
        await queryRunner.createIndex(
            'permission_translations',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //report_action_choice_translations
        await queryRunner.createIndex(
            'report_action_choice_translations',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //report_action_choices
        await queryRunner.createIndex(
            'report_action_choices',
            new TableIndex({ columnNames: ['report_action_choice_code'] }),
        );

        //user_group_assignment_histories
        await queryRunner.createIndex(
            'user_group_assignment_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'user_group_assignment_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        //user_group_assignments
        await queryRunner.createIndex(
            'user_group_assignments',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        //user_group_role_name_translations
        await queryRunner.createIndex(
            'user_group_role_name_translations',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //user_histories
        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['email'] }),
        );

        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        //users
        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['current_status'] }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['iso_locale_code'] }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['surname'] }),
        );

        //user_group_settings
        await queryRunner.createIndex(
            'user_group_settings',
            new TableIndex({ columnNames: ['is_archived'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //custom_inspection_form_histories;
        await queryRunner.dropIndex(
            'custom_inspection_form_histories',
            'IDX_3c29f5771d74db43ff335dcc06',
        );

        //custom_inspection_item_histories
        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_bf36f592bfb56fc39a71b3653b',
        );

        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_d178134b41c85b104e668ac022',
        );

        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_b13ba3ad0ccaf72d5f3ec0d671',
        );

        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_92dfeff524ea1a033371105448',
        );

        //custom_inspection_items
        await queryRunner.dropIndex(
            'custom_inspection_items',
            'IDX_019c93ebd260f1e28e88b58944',
        );

        await queryRunner.dropIndex(
            'custom_inspection_items',
            'IDX_8d8219ed936dc02d612305577c',
        );

        await queryRunner.dropIndex(
            'custom_inspection_items',
            'IDX_8e040fb563d0835dcaff347df0',
        );

        //devices
        await queryRunner.dropIndex(
            'devices',
            'IDX_a2b2563afdf4001c696638ba50',
        );

        //group_histories
        await queryRunner.dropIndex(
            'group_histories',
            'IDX_843bee2dbbfd48ac461b44bd75',
        );

        await queryRunner.dropIndex(
            'group_histories',
            'IDX_567f51da355862288cdfcb05e2',
        );

        //inspection_form_template_translations
        await queryRunner.dropIndex(
            'inspection_form_template_translations',
            'IDX_2f01415f422fb2e385fe8ebaeb',
        );

        //inspection_histories
        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_311d35fed556cffcd058e35378',
        );

        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_16e9511a142a5be1cce5223a89',
        );

        //inspection_item_template_translations
        await queryRunner.dropIndex(
            'inspection_item_template_translations',
            'IDX_170264543afeb6fe97708387cf',
        );

        //inspection_item_templates
        await queryRunner.dropIndex(
            'inspection_item_templates',
            'IDX_ac2fbc825bae99d8f5ffc09ebc',
        );

        await queryRunner.dropIndex(
            'inspection_item_templates',
            'IDX_282632363ab517245b29586bb2',
        );

        //inspection_result_histories
        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_9d8d5b500f3fbe09fee675c187',
        );

        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_dbf0fb1f3ed3cb4d301ca85ba0',
        );

        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_9ada44c203a24d2dd9ce9a0573',
        );

        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_8289cf5fd8266af8b3934543e1',
        );

        //inspection_results
        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_35aee42cd8949dc0b1d11acc0a',
        );

        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_b3d0adb4395cf1a5680b78fbb2',
        );

        //inspections
        await queryRunner.dropIndex(
            'inspections',
            'IDX_a5672fa6c3725aa94629a2f5c8',
        );

        await queryRunner.dropIndex(
            'inspections',
            'IDX_d6d5195b586e6440ac5592a506',
        );

        //machine_condition_histories
        await queryRunner.dropIndex(
            'machine_condition_histories',
            'IDX_20fe5e8454c14ee5126f39ea4a',
        );

        await queryRunner.dropIndex(
            'machine_condition_histories',
            'IDX_0e1a8c9cb1aa8406bb5e778782',
        );

        //machine_histories
        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_e58b2aa858a98d309431249d88',
        );

        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_6d81be474b466728d82c74f73a',
        );

        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_1cf972068e9f0639f183e2de3d',
        );

        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_0b145adcddbbd62466a9f9e4ff',
        );

        //machine_report_histories
        await queryRunner.dropIndex(
            'machine_report_histories',
            'IDX_88e22a6989ce099b67ef79cce6',
        );

        await queryRunner.dropIndex(
            'machine_report_histories',
            'IDX_25be4cc41f6bf89d5649d8cc58',
        );

        //machine_report_responses
        await queryRunner.dropIndex(
            'machine_report_responses',
            'IDX_eb9606aec521e8a2a60e667443',
        );

        await queryRunner.dropIndex(
            'machine_report_responses',
            'IDX_4f67b074c366c16e5381682151',
        );

        //machine_type_translations
        await queryRunner.dropIndex(
            'machine_type_translations',
            'IDX_952fcb484e5addf46bc6afa439',
        );

        //machines
        await queryRunner.dropIndex(
            'machines',
            'IDX_94e358607e84dfd30e7fd396be',
        );

        await queryRunner.dropIndex(
            'machines',
            'IDX_c7c3a3353238c4e71535a30ddd',
        );

        await queryRunner.dropIndex(
            'machines',
            'IDX_50384a938944bc326e96ae6dc7',
        );

        //permission_translations
        await queryRunner.dropIndex(
            'permission_translations',
            'IDX_9b180efaded59c346a689a2034',
        );

        //report_action_choice_translations
        await queryRunner.dropIndex(
            'report_action_choice_translations',
            'IDX_4d712fe14dd8208bd98a0334ac',
        );

        //report_action_choices
        await queryRunner.dropIndex(
            'report_action_choices',
            'IDX_3a20d87f7802de402aca1bcb92',
        );

        //user_group_assignment_histories
        await queryRunner.dropIndex(
            'user_group_assignment_histories',
            'IDX_bb237b5e9aef4eaeb8b47c13bc',
        );

        await queryRunner.dropIndex(
            'user_group_assignment_histories',
            'IDX_8efa40df0e09b7490d83cfb111',
        );

        //user_group_assignments
        await queryRunner.dropIndex(
            'user_group_assignments',
            'IDX_d37578aedda60f6eb6404e252c',
        );

        //user_group_role_name_translations
        await queryRunner.dropIndex(
            'user_group_role_name_translations',
            'IDX_f67d0c4c8d142f5cc45adbeb70',
        );

        //user_histories
        await queryRunner.dropIndex(
            'user_histories',
            'IDX_703465412cd1b77e018d35ad44',
        );

        await queryRunner.dropIndex(
            'user_histories',
            'IDX_f618c8acb30f1f3f90782c85d2',
        );

        await queryRunner.dropIndex(
            'user_histories',
            'IDX_6de96e2e34de2b80a4c3384146',
        );

        await queryRunner.dropIndex(
            'user_histories',
            'IDX_9e9bae619efc8840432dc932ea',
        );

        //users
        await queryRunner.dropIndex('users', 'IDX_46552ecdcef41f446c451702c8');

        await queryRunner.dropIndex('users', 'IDX_5d6bb8b8d415f4808a784b4aa9');

        await queryRunner.dropIndex('users', 'IDX_79e90c2c1f7516bbf60e1e71b3');

        //user_group_settings
        await queryRunner.dropIndex(
            'user_group_settings',
            'IDX_43947b2e283295e431f540dddc',
        );
    }
}
