import { MigrationInterface, QueryRunner } from 'typeorm';

import {
    machineManufacturerTemplateData,
    machineTypeTemplateData,
} from '../template-data';

export class MachineTypeAndMachineManufacturerTemplateData1701164960476
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await machineManufacturerTemplateData(queryRunner);
        await machineTypeTemplateData(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM machine_manufacturers');
        await queryRunner.query('DELETE FROM machine_types');
    }
}
