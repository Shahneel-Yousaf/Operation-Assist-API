import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOilCoolantRefillExchangesTable1719480981861
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE [dbo].[oil_coolant_refill_exchanges] ALTER COLUMN [fluid_in_liters] decimal(10,3) NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE [dbo].[oil_coolant_refill_exchanges] ALTER COLUMN [fluid_in_liters] decimal(10,3) NOT NULL;',
        );
    }
}
