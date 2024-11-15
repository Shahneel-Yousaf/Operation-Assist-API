import { MachineReportUserRead } from '@machine-report/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MachineReportUserReadRepository extends Repository<MachineReportUserRead> {
  constructor(private dataSource: DataSource) {
    super(MachineReportUserRead, dataSource.createEntityManager());
  }
}
