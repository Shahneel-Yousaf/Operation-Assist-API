import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateInspectionIndex1712718230372 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            'machine_report_responses',
            new TableIndex({ columnNames: ['status'] }),
        );

        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['inspection_id'] }),
        );

        await queryRunner.createIndex(
            'inspection_histories',
            new TableIndex({ columnNames: ['event_type'] }),
        );

        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['result'] }),
        );

        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['inspection_id'] }),
        );

        await queryRunner.createIndex(
            'inspections',
            new TableIndex({ columnNames: ['current_status'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex(
            'machine_report_responses',
            'IDX_eb9606aec521e8a2a60e667443',
        );

        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_de93fd6e301d9ead7e7a2617cd',
        );

        await queryRunner.dropIndex(
            'inspection_histories',
            'IDX_16e9511a142a5be1cce5223a89',
        );

        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_20d4303ed865164eb655766192',
        );

        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_05f913e654de1e86ac6bb62421',
        );

        await queryRunner.dropIndex(
            'inspections',
            'IDX_a5672fa6c3725aa94629a2f5c8',
        );
    }
}
