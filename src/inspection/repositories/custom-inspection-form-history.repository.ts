import { CustomInspectionFormHistory } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import {
  MachineHistoryType,
  MachineReportCurrentStatus,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomInspectionFormHistoryRepository extends Repository<CustomInspectionFormHistory> {
  constructor(private dataSource: DataSource) {
    super(CustomInspectionFormHistory, dataSource.createEntityManager());
  }

  getCustomInspectionFormHistoriesQuery(machineId: string, limit: number) {
    const customInspectionFormHistories = this.createQueryBuilder(
      'customInspectionFormHistories',
    )
      .select([
        `'${MachineHistoryType.INSPECTION_FORM}' "machineHistoryType"`,
        'customInspectionFormHistories.customInspectionFormId "machineHistoryId"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'customInspectionFormHistories.eventAt "eventAt"',
        'customInspectionFormHistories.currentStatus "currentStatus"',
        'customInspectionFormHistories.name "inspectionFormName"',
        `'' "subtype"`,
        `'' "status"`,
      ])
      .innerJoin('customInspectionFormHistories.user', 'user')
      .where(`customInspectionFormHistories.machineId = '${machineId}'`)
      .andWhere(
        `customInspectionFormHistories.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      );

    if (limit) {
      customInspectionFormHistories.orderBy('eventAt', 'DESC').limit(limit);
    }

    return customInspectionFormHistories.getQuery();
  }
}
