import { Injectable } from '@nestjs/common';
import { MaintenanceReasonChoice } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MaintenanceReasonChoiceRepository extends Repository<MaintenanceReasonChoice> {
  constructor(private dataSource: DataSource) {
    super(MaintenanceReasonChoice, dataSource.createEntityManager());
  }
}
