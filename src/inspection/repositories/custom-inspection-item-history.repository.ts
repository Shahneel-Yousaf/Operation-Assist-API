import { CustomInspectionItemHistory } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomInspectionItemHistoryRepository extends Repository<CustomInspectionItemHistory> {
  constructor(private dataSource: DataSource) {
    super(CustomInspectionItemHistory, dataSource.createEntityManager());
  }
}
