import { InspectionResultHistory } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InspectionResultHistoryRepository extends Repository<InspectionResultHistory> {
  constructor(private dataSource: DataSource) {
    super(InspectionResultHistory, dataSource.createEntityManager());
  }
}
