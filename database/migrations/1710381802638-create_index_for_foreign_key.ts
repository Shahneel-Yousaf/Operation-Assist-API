import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexForForeignKey1710381802638
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        // notifications
        await queryRunner.createIndex(
            'notifications',
            new TableIndex({ columnNames: ['user_id'] }),
        );
        await queryRunner.createIndex(
            'notifications',
            new TableIndex({ columnNames: ['inspection_id'] }),
        );
        await queryRunner.createIndex(
            'notifications',
            new TableIndex({ columnNames: ['machine_report_response_id'] }),
        );

        // devices
        await queryRunner.createIndex(
            'devices',
            new TableIndex({ columnNames: ['user_id'] }),
        );

        // user_ciam_links
        await queryRunner.createIndex(
            'user_ciam_links',
            new TableIndex({ columnNames: ['user_id'] }),
        );

        // user_histories
        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'user_histories',
            new TableIndex({ columnNames: ['user_id'] }),
        );

        // group_invitations
        await queryRunner.createIndex(
            'group_invitations',
            new TableIndex({ columnNames: ['group_id'] }),
        );
        await queryRunner.createIndex(
            'group_invitations',
            new TableIndex({ columnNames: ['inviter_user_id'] }),
        );
        await queryRunner.createIndex(
            'group_invitations',
            new TableIndex({ columnNames: ['invitee_user_id'] }),
        );
        await queryRunner.createIndex(
            'group_invitations',
            new TableIndex({ columnNames: ['user_group_role_template_id'] }),
        );

        // user_group_assignments
        await queryRunner.createIndex(
            'user_group_assignments',
            new TableIndex({ columnNames: ['user_group_role_template_id'] }),
        );

        // group_histories
        await queryRunner.createIndex(
            'group_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'group_histories',
            new TableIndex({ columnNames: ['group_id'] }),
        );

        // machines
        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['machine_type_id'] }),
        );
        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['machine_manufacturer_id'] }),
        );
        await queryRunner.createIndex(
            'machines',
            new TableIndex({ columnNames: ['group_id'] }),
        );

        // machine_conditions
        await queryRunner.createIndex(
            'machine_conditions',
            new TableIndex({ columnNames: ['user_id'] }),
        );

        // machine_condition_histories
        await queryRunner.createIndex(
            'machine_condition_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'machine_condition_histories',
            new TableIndex({ columnNames: ['machine_id'] }),
        );

        // machine_histories
        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['machine_id'] }),
        );
        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['machine_type_id'] }),
        );
        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['machine_manufacturer_id'] }),
        );
        await queryRunner.createIndex(
            'machine_histories',
            new TableIndex({ columnNames: ['group_id'] }),
        );

        // inspection_item_templates
        await queryRunner.createIndex(
            'inspection_item_templates',
            new TableIndex({ columnNames: ['inspection_form_template_id'] }),
        );

        // custom_inspection_forms
        await queryRunner.createIndex(
            'custom_inspection_forms',
            new TableIndex({ columnNames: ['machine_id'] }),
        );

        // custom_inspection_items
        await queryRunner.createIndex(
            'custom_inspection_items',
            new TableIndex({ columnNames: ['custom_inspection_form_id'] }),
        );

        // custom_inspection_item_medias
        await queryRunner.createIndex(
            'custom_inspection_item_medias',
            new TableIndex({ columnNames: ['custom_inspection_item_id'] }),
        );

        // custom_inspection_form_histories
        await queryRunner.createIndex(
            'custom_inspection_form_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'custom_inspection_form_histories',
            new TableIndex({ columnNames: ['custom_inspection_form_id'] }),
        );

        // custom_inspection_item_histories
        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({ columnNames: ['custom_inspection_item_id'] }),
        );
        await queryRunner.createIndex(
            'custom_inspection_item_histories',
            new TableIndex({
                columnNames: ['custom_inspection_form_history_id'],
            }),
        );

        // inspections
        await queryRunner.createIndex(
            'inspections',
            new TableIndex({ columnNames: ['machine_id'] }),
        );
        await queryRunner.createIndex(
            'inspections',
            new TableIndex({ columnNames: ['custom_inspection_form_id'] }),
        );

        // inspection_results
        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['custom_inspection_item_id'] }),
        );

        // inspection_histories
        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['inspection_id'] }),
        );
        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['machine_id'] }),
        );
        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['custom_inspection_form_id'] }),
        );

        // inspection_result_histories
        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['inspection_result_id'] }),
        );
        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['custom_inspection_item_id'] }),
        );
        await queryRunner.createIndex(
            'inspection_result_histories',
            new TableIndex({ columnNames: ['inspection_history_id'] }),
        );

        // machine_reports
        await queryRunner.createIndex(
            'machine_reports',
            new TableIndex({ columnNames: ['inspection_result_id'] }),
        );
        await queryRunner.createIndex(
            'machine_reports',
            new TableIndex({ columnNames: ['machine_id'] }),
        );

        // machine_report_histories
        await queryRunner.createIndex(
            'machine_report_histories',
            new TableIndex({ columnNames: ['machine_report_id'] }),
        );
        await queryRunner.createIndex(
            'machine_report_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'machine_report_histories',
            new TableIndex({ columnNames: ['inspection_result_id'] }),
        );
        await queryRunner.createIndex(
            'machine_report_histories',
            new TableIndex({ columnNames: ['machine_id'] }),
        );

        // permissions
        await queryRunner.createIndex(
            'permissions',
            new TableIndex({ columnNames: ['resource_id'] }),
        );
        await queryRunner.createIndex(
            'permissions',
            new TableIndex({ columnNames: ['operation_id'] }),
        );

        // user_group_assignment_histories
        await queryRunner.createIndex(
            'user_group_assignment_histories',
            new TableIndex({ columnNames: ['actioned_by_user_id'] }),
        );
        await queryRunner.createIndex(
            'user_group_assignment_histories',
            new TableIndex({ columnNames: ['user_id'] }),
        );
        await queryRunner.createIndex(
            'user_group_assignment_histories',
            new TableIndex({ columnNames: ['group_id'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // notifications
        await queryRunner.dropIndex(
            'notifications',
            'IDX_9a8a82462cab47c73d25f49261',
        );
        await queryRunner.dropIndex(
            'notifications',
            'IDX_60c416a624e2012f06df368cf7',
        );
        await queryRunner.dropIndex(
            'notifications',
            'IDX_641e3adc9d75e16d298d57aef2',
        );

        // devices
        await queryRunner.dropIndex(
            'devices',
            'IDX_5e9bee993b4ce35c3606cda194',
        );

        // user_ciam_links
        await queryRunner.dropIndex(
            'user_ciam_links',
            'IDX_9f85498d6e578061226abeb58d',
        );

        // user_histories
        await queryRunner.dropIndex(
            'user_histories',
            'IDX_a0c6e78fffeccd1b8115e32d05',
        );
        await queryRunner.dropIndex(
            'user_histories',
            'IDX_de3cbd852ec3d0d8e8b8f1eb27',
        );

        // group_invitations
        await queryRunner.dropIndex(
            'group_invitations',
            'IDX_312f24bd763f755ac2c1604083',
        );
        await queryRunner.dropIndex(
            'group_invitations',
            'IDX_411f24ad2835385b6f4a8a9435',
        );
        await queryRunner.dropIndex(
            'group_invitations',
            'IDX_2a80ea9225efdf34a71cde3475',
        );
        await queryRunner.dropIndex(
            'group_invitations',
            'IDX_b34a201d1c2b3c433cb277cd49',
        );

        // user_group_assignments
        await queryRunner.dropIndex(
            'user_group_assignments',
            'IDX_5f000be3e9916025140ce4c5f8',
        );

        // group_histories
        await queryRunner.dropIndex(
            'group_histories',
            'IDX_4d7b7998b4a042479557da0b88',
        );
        await queryRunner.dropIndex(
            'group_histories',
            'IDX_18156c8e6f6176c80ed5d09ab2',
        );

        // machines
        await queryRunner.dropIndex(
            'machines',
            'IDX_cde756a1fae3f931dde27c45ed',
        );
        await queryRunner.dropIndex(
            'machines',
            'IDX_8cd4fbc96b5b8648b4fb35ffd2',
        );
        await queryRunner.dropIndex(
            'machines',
            'IDX_58f7eda33d4cab9cf330af7603',
        );

        // machine_conditions
        await queryRunner.dropIndex(
            'machine_conditions',
            'IDX_2d85e9bf99e5250893ef916c5a',
        );

        // machine_condition_histories
        await queryRunner.dropIndex(
            'machine_condition_histories',
            'IDX_da964c507c3a6016e08070ecf2',
        );
        await queryRunner.dropIndex(
            'machine_condition_histories',
            'IDX_267b516db2b376dd3741276681',
        );

        // machine_histories
        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_9824c2d1060da3d0582ea9c2be',
        );
        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_02b3796fc8f2540f87d8e5d21f',
        );
        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_588bc1dcc86c4f9e339999c513',
        );
        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_be9bfc598ca8fc21d041572737',
        );
        await queryRunner.dropIndex(
            'machine_histories',
            'IDX_705bcf38ea1c249043a3f3e7dc',
        );

        // inspection_item_templates
        await queryRunner.dropIndex(
            'inspection_item_templates',
            'IDX_88b9f13b3f450cab081c1ff4f9',
        );

        // custom_inspection_forms
        await queryRunner.dropIndex(
            'custom_inspection_forms',
            'IDX_ab08015cd5b634e616401413bf',
        );

        // custom_inspection_items
        await queryRunner.dropIndex(
            'custom_inspection_items',
            'IDX_78173f7183f4659bfeeeb30dae',
        );

        // custom_inspection_item_medias
        await queryRunner.dropIndex(
            'custom_inspection_item_medias',
            'IDX_433144f0e6c29f6cf336ea921c',
        );

        // custom_inspection_form_histories
        await queryRunner.dropIndex(
            'custom_inspection_form_histories',
            'IDX_87f1eb289b3447772107085da7',
        );
        await queryRunner.dropIndex(
            'custom_inspection_form_histories',
            'IDX_1df867df3ab1014b2cfc805d34',
        );

        // custom_inspection_item_histories
        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_0dc8345e0ea9c49f6d8352b926',
        );
        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_ba34213f132a2d97f3bf726f09',
        );
        await queryRunner.dropIndex(
            'custom_inspection_item_histories',
            'IDX_497b8c53aa59f5b7a6cf2a5483',
        );

        // inspections
        await queryRunner.dropIndex(
            'inspections',
            'IDX_a34195b3a196f95bdabb9dbb98',
        );
        await queryRunner.dropIndex(
            'inspections',
            'IDX_ccace26e057183cf86006ea54b',
        );

        // inspection_results
        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_309a38a03aa875e686ce0d0060',
        );

        // inspection_histories
        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_369665f2d3170d7ac56fb373cd',
        );
        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_de93fd6e301d9ead7e7a2617cd',
        );
        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_3b66413b7ae67f4c7d0baa4ccb',
        );
        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_ffa2ca12ebff7da7de257e7811',
        );

        // inspection_result_histories
        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_0185435487777c70cdbb49d821',
        );
        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_66ef7e7fc5cf4935727745fe76',
        );
        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_c736788e9852399f250a4d3f16',
        );
        await queryRunner.dropIndex(
            'inspection_result_histories',
            'IDX_2f7a623b48699d725273293df1',
        );

        // machine_reports
        await queryRunner.dropIndex(
            'machine_reports',
            'IDX_4abef275f8aaddf44d828f3831',
        );
        await queryRunner.dropIndex(
            'machine_reports',
            'IDX_9acd2bc6db02fcc14b3e017919',
        );

        // machine_report_histories
        await queryRunner.dropIndex(
            'machine_report_histories',
            'IDX_53fe83fadd26d969f5b706e41b',
        );
        await queryRunner.dropIndex(
            'machine_report_histories',
            'IDX_de72f81f9987eeb85acc6af0c1',
        );
        await queryRunner.dropIndex(
            'machine_report_histories',
            'IDX_10a4e082837ad83172434be942',
        );
        await queryRunner.dropIndex(
            'machine_report_histories',
            'IDX_7b41b449c69f96c7eac1ab8b28',
        );

        // permissions
        await queryRunner.dropIndex(
            'permissions',
            'IDX_a5b7bf2f14f8df49fc610e9a8b',
        );
        await queryRunner.dropIndex(
            'permissions',
            'IDX_466e789688587a5013d6e87331',
        );

        // user_group_assignment_histories
        await queryRunner.dropIndex(
            'user_group_assignment_histories',
            'IDX_e0ff7926aa42c08e4cb8a0d548',
        );
        await queryRunner.dropIndex(
            'user_group_assignment_histories',
            'IDX_5b291d5c726f0d859e37f3ff67',
        );
        await queryRunner.dropIndex(
            'user_group_assignment_histories',
            'IDX_770590b3de17aa1adc55968647',
        );
    }
}
