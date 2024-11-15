import { Injectable } from '@nestjs/common';
import { MaintenanceReasonPeriodChoice } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MaintenanceReasonPeriodChoiceRepository extends Repository<MaintenanceReasonPeriodChoice> {
  constructor(private dataSource: DataSource) {
    super(MaintenanceReasonPeriodChoice, dataSource.createEntityManager());
  }
}
