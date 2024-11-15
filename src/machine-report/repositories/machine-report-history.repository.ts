import { MachineHistoryOutputDto } from '@group/dtos';
import {
  CustomInspectionFormHistoryRepository,
  InspectionHistoryRepository,
} from '@inspection/repositories';
import { MachineReportHistory } from '@machine-report/entities';
import { Injectable } from '@nestjs/common';
import {
  MachineHistoryType,
  MachineReportCurrentStatus,
  Subtype,
  Version,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MachineReportHistoryRepository extends Repository<MachineReportHistory> {
  constructor(
    private dataSource: DataSource,
    private readonly inspectionHistoryRepository: InspectionHistoryRepository,
    private readonly customInspectionFormHistoryRepository: CustomInspectionFormHistoryRepository,
  ) {
    super(MachineReportHistory, dataSource.createEntityManager());
  }

  getMachineReportHistoriesQuery(
    machineId: string,
    limit: number,
    version?: string,
  ) {
    const machineReportHistories = this.createQueryBuilder(
      'machineReportHistories',
    )
      .select([
        `'${MachineHistoryType.MACHINE_REPORTS}' "machineHistoryType"`,
        'machineReportHistories.machineReportId "machineHistoryId"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'machineReportHistories.eventAt "eventAt"',
        'machineReportHistories.currentStatus "currentStatus"',
        `'' "inspectionFormName"`,
        'lastMachineReportResponse.subtype "subtype"',
        'lastMachineReportResponse.status "status"',
      ])
      .innerJoin('machineReportHistories.user', 'user')
      .innerJoin(
        'machineReportHistories.lastMachineReportResponse',
        'lastMachineReportResponse',
      )
      .where(`machineReportHistories.machineId = '${machineId}'`)
      .andWhere(
        `machineReportHistories.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      )
      .andWhere(
        `lastMachineReportResponse.subtype NOT IN ('MACHINE_OPERATION_REPORTS', 'FUEL_MAINTENANCE_REPORTS')`,
      );

    if (version === Version.V1) {
      machineReportHistories.andWhere(
        `lastMachineReportResponse.subtype != '${Subtype.MAINTENANCE_REPORTS}'`,
      );
    }

    if (limit) {
      machineReportHistories.orderBy('eventAt', 'DESC').limit(limit);
    }

    return machineReportHistories.getQuery();
  }

  async getListMachineHistories(
    machineId: string,
    limit: number,
    offset: number,
    firstRequestTime: string,
    version?: string,
  ): Promise<MachineHistoryOutputDto[]> {
    const shouldLimit = offset ? undefined : limit;
    const machineReportHistories = this.getMachineReportHistoriesQuery(
      machineId,
      shouldLimit,
      version,
    );

    const inspectionHistories =
      this.inspectionHistoryRepository.getInspectionHistoriesQuery(
        machineId,
        shouldLimit,
      );

    const customInspectionFormHistories =
      this.customInspectionFormHistoryRepository.getCustomInspectionFormHistoriesQuery(
        machineId,
        shouldLimit,
      );

    const machineLimit = limit
      ? `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
      : '';

    return await this.query(`
      SELECT
        machineHistoryType,
        machineHistoryId,
        givenName,
        surname,
        eventAt,
        currentStatus,
        inspectionFormName,
        subtype,
        status
      FROM (${machineReportHistories}
      UNION
        ${inspectionHistories}
      UNION
        ${customInspectionFormHistories}) AS histories
      WHERE eventAt <= '${firstRequestTime}'
      ORDER BY
        eventAt DESC
      ${machineLimit}`);
  }
}
