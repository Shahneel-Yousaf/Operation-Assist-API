import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTables1697518005930 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //group_invitations
        await queryRunner.query(
            'UPDATE group_invitations SET invitation_response = UPPER(invitation_response);',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //group_invitations
        await queryRunner.query(
            'UPDATE group_invitations SET invitation_response = LOWER(invitation_response);',
        );
    }
}
