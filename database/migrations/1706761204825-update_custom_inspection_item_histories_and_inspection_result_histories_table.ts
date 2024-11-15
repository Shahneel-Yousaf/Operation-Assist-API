import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCustomInspectionItemHistoriesAndInspectionResultHistoriesTable1706761204825
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        //custom_inspection_item_histories
        //inspection_result_histories
        await queryRunner.addColumn(
            'custom_inspection_item_histories',
            new TableColumn({
                name: 'custom_inspection_form_history_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );
        await queryRunner.addColumn(
            'inspection_result_histories',
            new TableColumn({
                name: 'inspection_history_id',
                type: 'CHAR(26)',
                isNullable: true,
            }),
        );
        await queryRunner.query(`
            UPDATE 
                ciih 
            SET 
                ciih.custom_inspection_form_history_id = cifh.custom_inspection_form_history_id 
            FROM 
                custom_inspection_item_histories AS ciih 
                JOIN custom_inspection_form_histories AS cifh 
                    ON cifh.custom_inspection_form_id = ciih.custom_inspection_form_id 
                        AND cifh.event_at = ciih.event_at;
        `);
        await queryRunner.query(`
            UPDATE 
                irh 
            SET 
                irh.inspection_history_id = ih.inspection_history_id 
            FROM 
                inspection_result_histories AS irh 
                JOIN inspection_histories AS ih
                    ON ih.inspection_id = irh.inspection_id 
                        AND ih.event_at = irh.event_at;
        `);
        await queryRunner.query(
            'ALTER TABLE custom_inspection_item_histories ALTER COLUMN custom_inspection_form_history_id CHAR(26) NOT NULL;',
        );
        await queryRunner.query(
            'ALTER TABLE inspection_result_histories ALTER COLUMN inspection_history_id CHAR(26) NOT NULL;',
        );
        await queryRunner.dropColumn(
            'custom_inspection_item_histories',
            'custom_inspection_form_id',
        );
        await queryRunner.dropColumn(
            'inspection_result_histories',
            'inspection_id',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //custom_inspection_item_histories
        await queryRunner.addColumn(
            'custom_inspection_item_histories',
            new TableColumn({
                name: 'custom_inspection_form_id',
                type: ' CHAR(26)',
            }),
        );
        await queryRunner.dropColumn(
            'custom_inspection_item_histories',
            'custom_inspection_form_history_id',
        );

        //inspection_result_histories
        await queryRunner.dropColumn(
            'inspection_result_histories',
            'inspection_history_id',
        );
        await queryRunner.addColumn(
            'inspection_result_histories',
            new TableColumn({
                name: 'inspection_id',
                type: ' CHAR(26)',
            }),
        );
    }
}
