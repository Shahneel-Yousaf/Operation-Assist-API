import { Injectable } from '@nestjs/common';
import { ReportActionChoice } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReportActionChoiceRepository extends Repository<ReportActionChoice> {
  constructor(private dataSource: DataSource) {
    super(ReportActionChoice, dataSource.createEntityManager());
  }
}
