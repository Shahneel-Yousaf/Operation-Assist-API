import { Injectable } from '@nestjs/common';
import { RegularMaintenanceItemChoice } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RegularMaintenanceItemChoiceRepository extends Repository<RegularMaintenanceItemChoice> {
  constructor(private dataSource: DataSource) {
    super(RegularMaintenanceItemChoice, dataSource.createEntityManager());
  }
}
