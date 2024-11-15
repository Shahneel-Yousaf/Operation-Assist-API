import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreatePerformaceRecommendationsIndex1710313059824
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //inspection_results
        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['inspection_id'] }),
        );

        await queryRunner.createIndex(
            'inspection_results',
            new TableIndex({ columnNames: ['result'] }),
        );

        //machine_report_medias
        await queryRunner.createIndex(
            'machine_report_medias',
            new TableIndex({ columnNames: ['machine_report_response_id'] }),
        );

        //machine_reports
        await queryRunner.createIndex(
            'machine_reports',
            new TableIndex({ columnNames: ['current_status'] }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //inspection_results
        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_20d4303ed865164eb655766192',
        );

        await queryRunner.dropIndex(
            'inspection_results',
            'IDX_05f913e654de1e86ac6bb62421',
        );

        //machine_report_medias
        await queryRunner.dropIndex(
            'machine_report_medias',
            'IDX_323ad62c380a3447d7e5e1f03e',
        );

        //machine_reports
        await queryRunner.dropIndex(
            'machine_reports',
            'IDX_8c87613d83ff0a8c65b62ce72a',
        );
    }
}
