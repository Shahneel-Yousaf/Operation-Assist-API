import { InspectionRepository } from '@inspection/repositories';
import {
  GetMachineReportsForWebappOrderBy,
  GetMachineSummaryOrderBy,
} from '@machine-report/dtos';
import { MachineReport } from '@machine-report/entities';
import { Injectable } from '@nestjs/common';
import {
  EventType,
  ISOLocaleCode,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineReportSortByField,
  MachineSummaryType,
  Order,
  Subtype,
} from '@shared/constants';
import { summaryOrderBys } from '@shared/utils/commons';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MachineReportRepository extends Repository<MachineReport> {
  constructor(
    private dataSource: DataSource,
    private readonly inspectionRepository: InspectionRepository,
  ) {
    super(MachineReport, dataSource.createEntityManager());
  }

  async getListMachineReport(
    machineId: string,
    userId: string,
    limit: number,
    offset: number,
    firstRequestTime: string,
  ) {
    const machineReports = this.createQueryBuilder('machineReports')
      .select([
        'machineReports.machineReportId "machineReportId"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        `machineReports.inspectionResultId "reportType"`,
        'lastMachineReportResponse.commentedAt "reportedAt"',
        'machineReports.reportTitle "reportTitle"',
        'firstMachineReportResponse.reportComment "firstReportComment"',
        'lastMachineReportResponse.machineReportResponseId "reportCommentId"',
        'machineReports.currentStatus "reportStatus"',
        'machineReportUserReads.userId "isRead"',
        'lastMachineReportResponse.status "reportResponseStatus"',
        'lastMachineReportResponse.serviceMeterInHour "serviceMeterInHour"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .innerJoin('firstMachineReportResponse.user', 'user')
      .innerJoin(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
      )
      .leftJoin(
        'machineReports.machineReportUserReads',
        'machineReportUserReads',
        'machineReportUserReads.userId = :userId',
      )
      .where('machineReports.currentStatus != :draft')
      .andWhere('machineReports.machineId = :machineId')
      .andWhere('lastMachineReportResponse.commentedAt <= :firstRequestTime')
      .andWhere('firstMachineReportResponse.subtype = :incidentReport');

    if (limit) {
      machineReports.limit(limit).offset(offset);
    }

    return machineReports
      .orderBy('lastMachineReportResponse.commentedAt', 'DESC')
      .addOrderBy('machineReports.machineReportId', 'DESC')
      .setParameters({
        machineId,
        userId,
        limit,
        draft: MachineReportCurrentStatus.DRAFT,
        eventType: EventType.CREATE,
        firstRequestTime,
        incidentReport: Subtype.INCIDENT_REPORTS,
      })
      .getRawMany();
  }

  async getMachineReportDetail(
    machineReportId: string,
    userId: string,
    isoLocaleCode: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .innerJoinAndSelect(
        'machineReports.machineReportResponses',
        'machineReportResponses',
      )
      .innerJoinAndSelect('machineReportResponses.user', 'user')
      .leftJoinAndSelect(
        'machineReports.machineReportUserReads',
        'machineReportUserReads',
        'machineReportUserReads.userId = :userId',
      )
      .leftJoinAndSelect(
        'machineReportResponses.reportActions',
        'reportActions',
      )
      .leftJoinAndSelect(
        'reportActions.reportActionChoice',
        'reportActionChoice',
      )
      .leftJoinAndSelect(
        'reportActionChoice.reportActionChoiceTranslation',
        'reportActionChoiceTranslation',
        'reportActionChoiceTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'machineReportResponses.machineReportMedias',
        'machineReportMedias',
      )
      .where('machineReports.machineReportId = :machineReportId')
      .orderBy('machineReportResponses.commentedAt')
      .addOrderBy('reportActionChoice.reportActionChoiceCode', 'DESC')
      .setParameters({
        machineReportId,
        userId,
        isoLocaleCode,
      })
      .getOne();
  }
  async getMachineReportInfo(
    machineReportId: string,
    userId: string,
    isoLocaleCode: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .innerJoinAndSelect(
        'machineReports.machineReportResponses',
        'machineReportResponses',
      )
      .innerJoinAndSelect('machineReportResponses.user', 'user')
      .leftJoinAndSelect(
        'machineReportResponses.machineReportMedias',
        'machineReportMedias',
      )
      .leftJoinAndSelect(
        'machineReports.machineReportUserReads',
        'machineReportUserReads',
        'machineReportUserReads.userId = :userId',
      )
      .where('machineReports.machineReportId = :machineReportId')
      .orderBy('machineReportResponses.commentedAt')
      .setParameters({
        machineReportId,
        userId,
        isoLocaleCode,
      })
      .getOne();
  }

  async getListMachineReportForWebapp(
    machineId: string,
    limit: number,
    offset: number,
    isoLocaleCode: ISOLocaleCode,
    responseStatus: MachineReportResponseStatus,
    orderBys: GetMachineReportsForWebappOrderBy[],
    userId: string,
  ) {
    const machineReports = this.createQueryBuilder('machineReports')
      .select([
        'machineReports.machineReportId "machineReportId"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        `machineReports.inspectionResultId "reportType"`,
        'lastMachineReportResponse.commentedAt "reportedAt"',
        'machineReports.reportTitle "reportTitle"',
        'firstMachineReportResponse.reportComment "firstReportComment"',
        'lastMachineReportResponse.machineReportResponseId "reportCommentId"',
        'lastMachineReportResponse.status "reportResponseStatus"',
        'firstMachineReportResponse.lat "lat"',
        'firstMachineReportResponse.lng "lng"',
        'firstMachineReportResponse.commentedAt "firstReportedAt"',
        'machineReportUserRead.userId "isRead"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .innerJoin('firstMachineReportResponse.user', 'user')
      .innerJoin(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
      )
      .leftJoin(
        'machineReports.machineReportUserRead',
        'machineReportUserRead',
        'machineReportUserRead.userId = :userId',
      )
      .where('machineReports.machineId = :machineId');

    if (limit) {
      machineReports.limit(limit);
    }

    if (responseStatus) {
      machineReports.andWhere(
        'lastMachineReportResponse.status = :responseStatus',
      );
    }

    if (orderBys?.length) {
      orderBys.forEach((orderBy) => {
        switch (orderBy.field) {
          case MachineReportSortByField.REPORTER_NAME:
            machineReports
              .addOrderBy('user.surname', orderBy.order)
              .addOrderBy('user.givenName', orderBy.order);
            break;

          case MachineReportSortByField.REPORT_TYPE:
            machineReports.addOrderBy(
              `CASE WHEN machineReports.inspectionResultId IS NULL THEN 'MACHINE' ELSE 'INSPECTION' END`,
              orderBy.order,
            );
            break;

          default:
            machineReports.addOrderBy(orderBy.field, orderBy.order);
            break;
        }
      });
    } else {
      machineReports.orderBy('lastMachineReportResponse.commentedAt', 'DESC');
    }

    return machineReports
      .andWhere('machineReports.currentStatus != :draft')
      .addOrderBy(
        'machineReports.machineReportId',
        orderBys?.pop().order ?? Order.DESC,
      )
      .offset(offset)
      .setParameters({
        machineId,
        limit,
        draft: MachineReportCurrentStatus.DRAFT,
        isoLocaleCode,
        responseStatus,
        userId,
      })
      .getRawMany();
  }

  async getReportActionChoiceForWebapp(
    machineReportIds: string[],
    isoLocaleCode: ISOLocaleCode,
  ) {
    const machineReports = this.createQueryBuilder('machineReports')
      .innerJoinAndSelect(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
      )
      .innerJoinAndSelect(
        'lastMachineReportResponse.reportActions',
        'reportActions',
      )
      .innerJoinAndSelect(
        'reportActions.reportActionChoice',
        'reportActionChoice',
      )
      .innerJoinAndSelect(
        'reportActionChoice.reportActionChoiceTranslation',
        'reportActionChoiceTranslation',
        'reportActionChoiceTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .where('machineReports.machineReportId IN (:...machineReportIds)');

    return machineReports
      .setParameters({
        machineReportIds,
        isoLocaleCode,
      })
      .getMany();
  }

  async countMachineReportForWebapp(
    machineId: string,
    responseStatus: MachineReportResponseStatus,
  ) {
    const machineReports = this.createQueryBuilder('machineReports')
      .innerJoin(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
      )
      .where('machineReports.machineId = :machineId')
      .andWhere('machineReports.currentStatus != :draft');

    if (responseStatus) {
      machineReports.andWhere(
        'lastMachineReportResponse.status = :responseStatus',
      );
    }

    return machineReports
      .setParameters({
        machineId,
        draft: MachineReportCurrentStatus.DRAFT,
        responseStatus,
      })
      .getCount();
  }

  async getMachineOperationReportDetail(
    machineReportId: string,
    userId: string,
    isoLocaleCode: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .innerJoinAndSelect(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .innerJoinAndSelect('firstMachineReportResponse.user', 'user')
      .innerJoinAndSelect(
        'firstMachineReportResponse.machineOperationReport',
        'machineOperationReport',
      )
      .where('machineReports.machineReportId = :machineReportId')
      .orderBy('firstMachineReportResponse.commentedAt')
      .setParameters({
        machineReportId,
        userId,
        isoLocaleCode,
      })
      .getOne();
  }

  getIncidentReportQuery(
    machineId: string,
    startTime: string,
    endTime: string,
    reportTypeTitle: string,
    summaryOrders: GetMachineSummaryOrderBy[],
    limitEachReport: number,
  ) {
    const query = this.createQueryBuilder('machineReports')
      .select([
        'machineReports.machineReportId "reportedId"',
        'machineReports.lastStatusUpdatedAt "reportedAt"',
        'firstMachineReportResponse.subType "reportType"',
        `N'${reportTypeTitle}' "reportTypeMessage"`,
        'machineReports.inspectionResultId "inspectionResultId"',
        'machineReports.reportTitle "reportItem"',
        'lastMachineReportResponse.status "reportResponseStatus"',
        'firstMachineReportResponse.serviceMeterInHour "serviceMeter"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        'firstMachineReportResponse.lng "lng"',
        'firstMachineReportResponse.lat "lat"',
        'firstMachineReportResponse.commentedAt "firstReportedAt"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
        `firstMachineReportResponse.subType =  '${MachineSummaryType.INCIDENT_REPORTS}'`,
      )
      .innerJoin(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
      )
      .innerJoin('firstMachineReportResponse.user', 'user')
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `machineReports.lastStatusUpdatedAt BETWEEN '${startTime}' AND '${endTime}'`,
      )
      .andWhere(
        `machineReports.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      );

    summaryOrders.forEach((orderBy) =>
      query.addOrderBy(orderBy.field, orderBy.order),
    );

    return query.limit(limitEachReport).getQuery();
  }

  getMachineOperationReportQuery(
    machineId: string,
    startTime: string,
    endTime: string,
    reportTypeTitle: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .select([
        'machineReports.machineReportId "reportedId"',
        'machineOperationReport.startAt "reportedAt"',
        'firstMachineReportResponse.subType "reportType"',
        `N'${reportTypeTitle}' "reportTypeMessage"`,
        'NULL "inspectionResultId"',
        'machineOperationReport.operationDetail "reportTitle"',
        'NULL "reportResponseStatus"',
        'NULL "serviceMeter"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        'firstMachineReportResponse.lng "lng"',
        'firstMachineReportResponse.lat "lat"',
        'firstMachineReportResponse.commentedAt "firstReportedAt"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
        `firstMachineReportResponse.subType = 'MACHINE_OPERATION_REPORTS'`,
      )
      .innerJoin(
        'firstMachineReportResponse.machineOperationReport',
        'machineOperationReport',
      )
      .innerJoin('firstMachineReportResponse.user', 'user')
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `machineOperationReport.startAt BETWEEN '${startTime}' AND '${endTime}'`,
      )
      .getQuery();
  }

  getFuelMaintenanceReportQuery(
    machineId: string,
    startTime: string,
    endTime: string,
    reportTypeTitle: string,
    fuelTitle: Record<string, string>,
  ) {
    const { fuel, oil, part } = fuelTitle;

    return this.createQueryBuilder('machineReports')
      .select([
        'machineReports.machineReportId "reportedId"',
        'fuelMaintenanceReport.workAt "reportedAt"',
        'firstMachineReportResponse.subType "reportType"',
        `N'${reportTypeTitle}' "reportTypeMessage"`,
        'NULL "inspectionResultId"',
        `CASE
          WHEN COUNT(fuelRefill.machineReportResponseId) > 0 THEN N'${fuel}'
          WHEN COUNT(oilCoolantRefillExchanges.machineReportResponseId) > 0 THEN N'${oil}'
          ELSE N'${part}'
        END "reportTitle"`,
        'COUNT(fuelRefill.machineReportResponseId) "fuelCount"',
        'COUNT(oilCoolantRefillExchanges.machineReportResponseId) "oilCount"',
        'COUNT(partReplacements.machineReportResponseId) "partCount"',
        'NULL "reportResponseStatus"',
        'fuelMaintenanceReport.serviceMeterInHour "serviceMeter"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        'firstMachineReportResponse.lng "lng"',
        'firstMachineReportResponse.lat "lat"',
        'firstMachineReportResponse.commentedAt "firstReportedAt"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
        `firstMachineReportResponse.subType = 'FUEL_MAINTENANCE_REPORTS'`,
      )
      .innerJoin('firstMachineReportResponse.user', 'user')
      .innerJoin(
        'firstMachineReportResponse.fuelMaintenanceReport',
        'fuelMaintenanceReport',
      )
      .leftJoin('fuelMaintenanceReport.fuelRefill', 'fuelRefill')
      .leftJoin(
        'fuelMaintenanceReport.oilCoolantRefillExchanges',
        'oilCoolantRefillExchanges',
      )
      .leftJoin('fuelMaintenanceReport.partReplacements', 'partReplacements')
      .where(
        `fuelMaintenanceReport.workAt BETWEEN '${startTime}' AND '${endTime}'`,
      )
      .andWhere(`machineReports.machineId = '${machineId}'`)
      .groupBy(
        `
        machineReports.machineReportId,
        fuelMaintenanceReport.workAt,
        firstMachineReportResponse.subType,
        machineReports.reportTitle,
        fuelMaintenanceReport.serviceMeterInHour,
        user.givenName,
        user.surname,
        user.pictureUrl,
        firstMachineReportResponse.lat,
        firstMachineReportResponse.lng,
        firstMachineReportResponse.commentedAt
      `,
      )
      .getQuery();
  }

  getMaintenanceReportQuery(
    machineId: string,
    startTime: string,
    endTime: string,
    reportTypeTitle: string,
    isoLocaleCode: ISOLocaleCode,
    summaryOrders: GetMachineSummaryOrderBy[],
    limitEachReport: number,
  ) {
    const query = this.createQueryBuilder('machineReports')
      .select([
        'machineReports.machineReportId "reportedId"',
        'maintenanceReport.workAt "reportedAt"',
        'firstMachineReportResponse.subType "reportType"',
        `N'${reportTypeTitle}' "reportTypeMessage"`,
        'NULL "inspectionResultId"',
        'regularMaintenanceItemChoiceTranslation.regularMaintenanceItemChoiceName "reportItem"',
        'NULL "reportResponseStatus"',
        'maintenanceReport.serviceMeterInHour "serviceMeter"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        'firstMachineReportResponse.lng "lng"',
        'firstMachineReportResponse.lat "lat"',
        'firstMachineReportResponse.commentedAt "firstReportedAt"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
        `firstMachineReportResponse.subType = '${MachineSummaryType.MAINTENANCE_REPORTS}'`,
      )
      .innerJoin(
        'firstMachineReportResponse.maintenanceReport',
        'maintenanceReport',
      )
      .innerJoin(
        'maintenanceReport.regularMaintenanceItemChoice',
        'regularMaintenanceItemChoice',
      )
      .innerJoin(
        'regularMaintenanceItemChoice.regularMaintenanceItemChoiceTranslation',
        'regularMaintenanceItemChoiceTranslation',
        `regularMaintenanceItemChoiceTranslation.isoLocaleCode = '${isoLocaleCode}'`,
      )
      .innerJoin('firstMachineReportResponse.user', 'user')
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `maintenanceReport.workAt BETWEEN '${startTime}' AND '${endTime}'`,
      );

    summaryOrders.forEach((orderBy) =>
      query.addOrderBy(orderBy.field, orderBy.order),
    );

    return query.limit(limitEachReport).getQuery();
  }

  getIncidentReportCountQuery(
    machineId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .select([
        `'${MachineSummaryType.INCIDENT_REPORTS}' "reportType"`,
        'COUNT(*) "count"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `machineReports.lastStatusUpdatedAt BETWEEN '${startDate}' AND '${endDate}'`,
      )
      .andWhere(
        `machineReports.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      )
      .andWhere(
        `firstMachineReportResponse.subType = '${MachineSummaryType.INCIDENT_REPORTS}'`,
      )
      .getQuery();
  }

  getMachineOperationReportCountQuery(
    machineId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .select([`'FUEL_MAINTENANCE_REPORTS' "reportType"`, 'COUNT(*) "count"'])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .innerJoin(
        'firstMachineReportResponse.machineOperationReport',
        'machineOperationReport',
      )
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `machineOperationReport.startAt BETWEEN '${startDate}' AND '${endDate}'`,
      )
      .andWhere(
        `machineReports.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      )
      .andWhere(
        `firstMachineReportResponse.subType = 'FUEL_MAINTENANCE_REPORTS'`,
      )
      .getQuery();
  }

  getFuelMaintenanceReportCountQuery(
    machineId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .select([`'FUEL_MAINTENANCE_REPORTS' "reportType"`, 'COUNT(*) "count"'])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .innerJoin(
        'firstMachineReportResponse.fuelMaintenanceReport',
        'fuelMaintenanceReport',
      )
      .leftJoin('fuelMaintenanceReport.fuelRefill', 'fuelRefill')
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `fuelMaintenanceReport.workAt BETWEEN '${startDate}' AND '${endDate}'`,
      )
      .andWhere(
        `machineReports.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      )
      .andWhere(
        `firstMachineReportResponse.subType = 'FUEL_MAINTENANCE_REPORTS'`,
      )
      .getQuery();
  }

  getMaintenanceReportCountQuery(
    machineId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .select([
        `'${MachineSummaryType.MAINTENANCE_REPORTS}' "reportType"`,
        'COUNT(*) "count"',
      ])
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .innerJoin(
        'firstMachineReportResponse.maintenanceReport',
        'maintenanceReport',
      )
      .where(`machineReports.machineId = '${machineId}'`)
      .andWhere(
        `maintenanceReport.workAt BETWEEN '${startDate}' AND '${endDate}'`,
      )
      .andWhere(
        `machineReports.currentStatus != '${MachineReportCurrentStatus.DRAFT}'`,
      )
      .andWhere(
        `firstMachineReportResponse.subType = '${MachineSummaryType.MAINTENANCE_REPORTS}'`,
      )
      .getQuery();
  }

  async getListMachineSummary(
    machineId: string,
    filterBy: Record<string, any>,
  ): Promise<any[]> {
    const {
      startDate,
      endDate,
      filter,
      limit,
      offset,
      orderBys,
      reportTypeTitle,
      isoLocaleCode,
    } = filterBy;

    const limitEachReport = limit + offset;
    const summaryOrders = summaryOrderBys(orderBys);

    const inspectionReports =
      this.inspectionRepository.getInspectionReportQuery(
        machineId,
        startDate,
        endDate,
        reportTypeTitle.inspection,
        summaryOrders,
        limitEachReport,
      );
    const incidentReports = this.getIncidentReportQuery(
      machineId,
      startDate,
      endDate,
      reportTypeTitle.incidentReport,
      summaryOrders,
      limitEachReport,
    );
    const maintenanceReports = this.getMaintenanceReportQuery(
      machineId,
      startDate,
      endDate,
      reportTypeTitle.maintenanceReport,
      isoLocaleCode,
      summaryOrders,
      limitEachReport,
    );

    const paginationClause = limit
      ? `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
      : '';

    const orderByClause =
      'ORDER BY ' +
      summaryOrders.map(({ field, order }) => `${field} ${order}`).join(',');

    let fromClause = `${inspectionReports} UNION ALL ${incidentReports} UNION ALL ${maintenanceReports}`;
    switch (filter) {
      case MachineSummaryType.INSPECTION:
        fromClause = inspectionReports;
        break;
      case MachineSummaryType.INCIDENT_REPORTS:
        fromClause = incidentReports;
        break;
      case MachineSummaryType.MAINTENANCE_REPORTS:
        fromClause = maintenanceReports;
        break;
    }
    return this.query(
      `SELECT * FROM (${fromClause}) AS machineSummary ${orderByClause} ${paginationClause}`,
    );
  }

  async countReportSummary(machineId: string, filterBy: Record<string, any>) {
    const { startDate, endDate, filter } = filterBy;

    const inspectionReports =
      this.inspectionRepository.getInspectionReportCountQuery(
        machineId,
        startDate,
        endDate,
      );
    const incidentReports = this.getIncidentReportCountQuery(
      machineId,
      startDate,
      endDate,
    );
    const maintenanceReports = this.getMaintenanceReportCountQuery(
      machineId,
      startDate,
      endDate,
    );
    let fromClause = `${inspectionReports} UNION ALL ${incidentReports} UNION ALL ${maintenanceReports}`;
    switch (filter) {
      case MachineSummaryType.INSPECTION:
        fromClause = inspectionReports;
        break;
      case MachineSummaryType.INCIDENT_REPORTS:
        fromClause = incidentReports;
        break;
      case MachineSummaryType.MAINTENANCE_REPORTS:
        fromClause = maintenanceReports;
        break;
    }
    return this.query(`SELECT * FROM (${fromClause}) AS countReportSummary`);
  }

  async getFuelMaintenanceReportDetail(
    isoLocaleCode: ISOLocaleCode,
    machineReportId: string,
  ) {
    return this.createQueryBuilder('machineReport')
      .innerJoinAndSelect(
        'machineReport.firstMachineReportResponse',
        'machineReportResponses',
      )
      .innerJoinAndSelect('machineReportResponses.user', 'user')
      .innerJoinAndSelect(
        'machineReportResponses.fuelMaintenanceReport',
        'fuelMaintenanceReport',
      )
      .leftJoinAndSelect('fuelMaintenanceReport.fuelRefill', 'fuelRefill')
      .leftJoinAndSelect(
        'fuelMaintenanceReport.oilCoolantRefillExchanges',
        'oilCoolantRefillExchanges',
      )
      .leftJoinAndSelect('oilCoolantRefillExchanges.oilType', 'oilType')
      .leftJoinAndSelect(
        'oilType.oilTypeTranslation',
        'oilTypeTranslation',
        'oilTypeTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'fuelMaintenanceReport.partReplacements',
        'partReplacements',
      )
      .leftJoinAndSelect('partReplacements.partType', 'partType')
      .leftJoinAndSelect(
        'partType.partTypeTranslation',
        'partTypeTranslation',
        'partTypeTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'partReplacements.partReplacementMedias',
        'partReplacementMedias',
      )
      .where('machineReport.machineReportId = :machineReportId')
      .setParameters({
        machineReportId,
        isoLocaleCode,
      })
      .getOne();
  }

  async getMaintenanceReportDetail(
    isoLocaleCode: ISOLocaleCode,
    machineReportId: string,
  ) {
    return this.createQueryBuilder('machineReports')
      .innerJoinAndSelect(
        'machineReports.firstMachineReportResponse',
        'machineReportResponses',
      )
      .innerJoinAndSelect('machineReportResponses.user', 'user')
      .innerJoinAndSelect(
        'machineReportResponses.maintenanceReport',
        'maintenanceReport',
      )
      .leftJoinAndSelect(
        'machineReportResponses.machineReportMedias',
        'machineReportMedias',
      )
      .innerJoinAndSelect(
        'maintenanceReport.regularMaintenanceItemChoice',
        'rMIC',
      )
      .innerJoinAndSelect(
        'rMIC.regularMaintenanceItemChoiceTranslation',
        'rMICT',
        'rMICT.isoLocaleCode = :isoLocaleCode',
      )
      .innerJoinAndSelect('maintenanceReport.maintenanceReasonChoice', 'mRC')
      .innerJoinAndSelect(
        'mRC.maintenanceReasonChoiceTranslation',
        'mRCT',
        'mRCT.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'maintenanceReport.maintenanceReasonPeriodChoice',
        'mRPC',
      )
      .leftJoinAndSelect(
        'mRPC.maintenanceReasonPeriodChoiceTranslation',
        'mRPCT',
        'mRPCT.isoLocaleCode = :isoLocaleCode',
      )
      .leftJoinAndSelect(
        'maintenanceReport.maintenanceReportIrregularMaintenanceItems',
        'mRIMI',
      )
      .leftJoinAndSelect('mRIMI.irregularMaintenanceItemChoice', 'iMIC')
      .leftJoinAndSelect(
        'iMIC.irregularMaintenanceItemChoiceTranslation',
        'iMICT',
        'iMICT.isoLocaleCode = :isoLocaleCode',
      )
      .where('machineReports.machineReportId = :machineReportId')
      .setParameters({
        machineReportId,
        isoLocaleCode,
      })
      .getOne();
  }
}
