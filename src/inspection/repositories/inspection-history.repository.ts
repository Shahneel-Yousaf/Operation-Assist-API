import { InspectionHistory } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import {
  MachineHistoryType,
  MachineReportCurrentStatus,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InspectionHistoryRepository extends Repository<InspectionHistory> {
  constructor(private dataSource: DataSource) {
    super(InspectionHistory, dataSource.createEntityManager());
  }

  getInspectionHistoriesQuery(machineId: string, limit: number) {
    const inspectionHistories = this.createQueryBuilder('inspectionHistories')
      .select([
        `'${MachineHistoryType.INSPECTIONS}' "machineHistoryType"`,
        'inspectionHistories.inspectionId "machineHistoryId"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'inspectionHistories.eventAt "eventAt"',
        'inspectionHistories.currentStatus "currentStatus"',
        'customInspectionForm.name "inspectionFormName"',
        `'' "subtype"`,
        `'' "status"`,
      ])
      .innerJoin('inspectionHistories.user', 'user')
      .innerJoin(
        'inspectionHistories.customInspectionForm',
        'customInspectionForm',
      )
      .where(`inspectionHistories.machineId = '${machineId}'`)
      .andWhere(
        `inspectionHistories.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      );

    if (limit) {
      inspectionHistories.orderBy('eventAt', 'DESC').limit(limit);
    }

    return inspectionHistories.getQuery();
  }
}
