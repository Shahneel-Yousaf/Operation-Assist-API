import { Injectable } from '@nestjs/common';
import { IrregularMaintenanceItemChoice } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class IrregularMaintenanceItemChoiceRepository extends Repository<IrregularMaintenanceItemChoice> {
  constructor(private dataSource: DataSource) {
    super(IrregularMaintenanceItemChoice, dataSource.createEntityManager());
  }
}
