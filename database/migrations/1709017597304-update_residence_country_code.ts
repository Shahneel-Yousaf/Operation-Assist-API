import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateResidenceCountryCode1709017597304
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `UPDATE users
            SET residence_country_code = 'O'
            WHERE 
                residence_country_code NOT IN ('BR', 'CL', 'CO', 'EG', 'JP', 'PH', 'SA', 'AE', 'O');`,
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
