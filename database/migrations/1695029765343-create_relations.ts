import { MigrationInterface, QueryRunner } from 'typeorm';

import { createForeignKeys, dropForeignKeys } from '../commons/functions';

export class CreateRelations1695029765343 implements MigrationInterface {
    name: 'CreateRelations1695029765343';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys: {
            keys: string[][];
            table: string;
            onDelete?: string;
        }[] = [
            //user_ciam_links
            {
                keys: [['user_id', 'user_id', 'users']],
                table: 'user_ciam_links',
            },
            // group_invitations
            {
                keys: [
                    ['inviter_user_id', 'user_id', 'users'],
                    ['invitee_user_id', 'user_id', 'users'],
                ],
                table: 'group_invitations',
                onDelete: 'NO ACTION',
            },
            {
                keys: [
                    ['group_id', 'group_id', 'groups'],
                    [
                        'user_group_role_template_id',
                        'user_group_role_template_id',
                        'user_group_role_templates',
                    ],
                ],
                table: 'group_invitations',
            },
            //machine_histories
            {
                keys: [
                    ['actioned_by_user_id', 'user_id', 'users'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'machine_histories',
            },
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
            //machines
            {
                keys: [['machine_type_id', 'machine_type_id', 'machine_types']],
                table: 'machines',
            },
            //group_machine_assignments
            {
                keys: [
                    ['group_id', 'group_id', 'groups'],
                    ['machine_id', 'machine_id', 'machines'],
                ],
                table: 'group_machine_assignments',
            },
            //group_histories
            {
                keys: [
                    ['group_id', 'group_id', 'groups'],
                    ['actioned_by_user_id', 'user_id', 'users'],
                ],
                table: 'group_histories',
            },
            //user_group_role_template_permission_assignments
            {
                keys: [
                    ['permission_id', 'permission_id', 'permissions'],
                    [
                        'user_group_role_template_id',
                        'user_group_role_template_id',
                        'user_group_role_templates',
                    ],
                ],
                table: 'user_group_role_template_permission_assignments',
            },
            //user_group_role_name_translations
            {
                keys: [
                    [
                        'user_group_role_template_id',
                        'user_group_role_template_id',
                        'user_group_role_templates',
                    ],
                ],
                table: 'user_group_role_name_translations',
            },
            //permissions
            {
                keys: [
                    ['resource_id', 'resource_id', 'resources'],
                    ['operation_id', 'operation_id', 'operations'],
                ],
                table: 'permissions',
            },
            //permission_translates
            {
                keys: [['permission_id', 'permission_id', 'permissions']],
                table: 'permission_translates',
            },
            //user_group_permission_invitations
            {
                keys: [
                    ['permission_id', 'permission_id', 'permissions'],
                    [
                        'group_invitation_id',
                        'group_invitation_id',
                        'group_invitations',
                    ],
                ],
                table: 'user_group_permission_invitations',
            },
            //user_group_permission_assignments
            {
                keys: [
                    ['permission_id', 'permission_id', 'permissions'],
                    ['group_id', 'group_id', 'groups'],
                    ['user_id', 'user_id', 'users'],
                ],
                table: 'user_group_permission_assignments',
            },
            //user_group_assignments
            {
                keys: [
                    ['user_id', 'user_id', 'users'],
                    ['group_id', 'group_id', 'groups'],
                    [
                        'user_group_role_template_id',
                        'user_group_role_template_id',
                        'user_group_role_templates',
                    ],
                ],
                table: 'user_group_assignments',
            },
        ];

        await createForeignKeys(foreignKeys, queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const foreignKeys = [
            //user_ciam_links
            ['user_ciam_links', 'FK_9f85498d6e578061226abeb58d5'],
            // group_invitations
            ['group_invitations', 'FK_411f24ad2835385b6f4a8a94353'],
            ['group_invitations', 'FK_2a80ea9225efdf34a71cde34755'],
            ['group_invitations', 'FK_312f24bd763f755ac2c1604083c'],
            ['group_invitations', 'FK_b34a201d1c2b3c433cb277cd499'],
            //machine_histories
            ['machine_histories', 'FK_9824c2d1060da3d0582ea9c2be3'],
            ['machine_histories', 'FK_02b3796fc8f2540f87d8e5d21fd'],
            //machine_note_histories
            ['machine_note_histories', 'FK_db3a37068733b989f00214fd09a'],
            ['machine_note_histories', 'FK_91ae12f4b60748231a5a3752970'],
            //machine_notes
            ['machine_notes', 'FK_e349c9582ad7fd18cb89a087015'],
            //machines
            ['machines', 'FK_cde756a1fae3f931dde27c45ed1'],
            //group_machine_assignments
            ['group_machine_assignments', 'FK_e98798cdd88d244459c09c39b85'],
            ['group_machine_assignments', 'FK_d719fe36ceef2ebe802d9a17f4e'],
            //group_histories
            ['group_histories', 'FK_18156c8e6f6176c80ed5d09ab23'],
            ['group_histories', 'FK_4d7b7998b4a042479557da0b88a'],
            //user_group_role_template_permission_assignments
            [
                'user_group_role_template_permission_assignments',
                'FK_feedecdc4f901d323b0519f2da7',
            ],
            [
                'user_group_role_template_permission_assignments',
                'FK_930caeafb70cca3a97a17df1a56',
            ],
            //user_group_role_name_translations
            [
                'user_group_role_name_translations',
                'FK_b3361b6832d765b301b02079ea5',
            ],
            //permissions
            ['permissions', 'FK_a5b7bf2f14f8df49fc610e9a8be'],
            ['permissions', 'FK_466e789688587a5013d6e873310'],
            //permission_translates
            ['permission_translates', 'FK_a18a3ae29ca666081f4e06b13d4'],
            //user_group_permission_invitations
            [
                'user_group_permission_invitations',
                'FK_3cd9a24242bfa1114b166daab26',
            ],
            [
                'user_group_permission_invitations',
                'FK_09cd991ae20309d63052b632610',
            ],
            //user_group_permission_assignments
            [
                'user_group_permission_assignments',
                'FK_a364a882cd3e6de86945652089a',
            ],
            [
                'user_group_permission_assignments',
                'FK_5f37c88d47a40cc247d388c0e46',
            ],
            [
                'user_group_permission_assignments',
                'FK_14c89d34574b6995ec5b3fe74b8',
            ],
            //user_group_assignments
            ['user_group_assignments', 'FK_d87efda0e54fbecd9944e8cd0c1'],
            ['user_group_assignments', 'FK_00c484c45b2bec8f97524e59108'],
            ['user_group_assignments', 'FK_5f000be3e9916025140ce4c5f82'],
        ];

        await dropForeignKeys(foreignKeys, queryRunner);
    }
}
