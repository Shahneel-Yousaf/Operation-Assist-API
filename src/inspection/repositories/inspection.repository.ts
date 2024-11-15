import { Inspection } from '@inspection/entities';
import { GetMachineSummaryOrderBy } from '@machine-report/dtos';
import { Injectable } from '@nestjs/common';
import {
  EventType,
  InspectionCurrentStatus,
  InspectionResultType,
  ItemCodeType,
  Order,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InspectionRepository extends Repository<Inspection> {
  constructor(private dataSource: DataSource) {
    super(Inspection, dataSource.createEntityManager());
  }
  async getListUserInspectionDraft(machineId: string, userId: string) {
    return this.createQueryBuilder('inspection')
      .select([
        'inspection.inspectionId "inspectionId"',
        'customInspectionForm.name "name"',
        'inspection.lastStatusUpdatedAt "lastStatusUpdatedAt"',
      ])
      .innerJoin(
        'inspection.inspectionHistories',
        'inspectionHistory',
        'inspectionHistory.actionedByUserId = :userId AND inspectionHistory.eventType = :createEvent',
      )
      .innerJoin('inspection.customInspectionForm', 'customInspectionForm')
      .where(
        'inspection.machineId = :machineId AND inspection.currentStatus = :draftStatus',
      )
      .setParameters({
        machineId,
        draftStatus: InspectionCurrentStatus.DRAFT,
        userId,
        createEvent: EventType.CREATE,
      })
      .orderBy('inspection.lastStatusUpdatedAt', 'DESC')
      .getRawMany();
  }

  async getListInspection(
    machineId: string,
    limit: number,
    offset: number,
    firstRequestTime: string,
  ) {
    const inspections = this.createQueryBuilder('inspection')
      .select([
        'inspection.inspectionId "inspectionId"',
        'customInspectionForm.name "name"',
        'inspection.lastStatusUpdatedAt "lastStatusUpdatedAt"',
        'COUNT(inspectionResults.result) "inspectionReportCount"',
      ])
      .innerJoin('inspection.customInspectionForm', 'customInspectionForm')
      .leftJoin(
        'inspection.inspectionResults',
        'inspectionResults',
        'inspectionResults.result = :resultType',
      )
      .where(
        'inspection.machineId = :machineId AND inspection.currentStatus = :postedStatus AND inspection.lastStatusUpdatedAt <= :firstRequestTime',
      )
      .groupBy(
        'inspection.inspectionId, customInspectionForm.name, inspection.lastStatusUpdatedAt',
      )
      .orderBy('inspection.lastStatusUpdatedAt', 'DESC');

    if (limit) {
      inspections.limit(limit).offset(offset);
    }

    return inspections
      .addOrderBy('inspection.inspectionId', Order.DESC)
      .setParameters({
        machineId,
        postedStatus: InspectionCurrentStatus.POSTED,
        resultType: InspectionResultType.ANOMARY,
        firstRequestTime,
      })
      .getRawMany();
  }

  async getInspectionDetail(machineId: string, inspectionId: string) {
    return this.createQueryBuilder('inspection')
      .innerJoinAndSelect(
        'inspection.inspectionHistories',
        'inspectionHistories',
        'inspectionHistories.eventType = :eventType',
      )
      .innerJoinAndSelect('inspectionHistories.user', 'user')
      .innerJoinAndSelect(
        'inspection.customInspectionForm',
        'customInspectionForm',
      )
      .innerJoinAndSelect('inspection.inspectionResults', 'inspectionResults')
      .innerJoinAndSelect(
        'inspectionResults.customInspectionItem',
        'customInspectionItem',
      )
      .leftJoinAndSelect(
        'customInspectionItem.customInspectionItemMedias',
        'customInspectionItemMedias',
      )
      .leftJoinAndSelect('inspectionResults.machineReport', 'machineReport')
      .leftJoinAndSelect(
        'machineReport.firstMachineReportResponse',
        'firstMachineReportResponse',
      )
      .leftJoinAndSelect(
        'firstMachineReportResponse.machineReportMedias',
        'machineReportMedias',
      )
      .where(
        'inspection.machineId = :machineId AND inspection.inspectionId = :inspectionId',
      )
      .orderBy('customInspectionItem.position')
      .setParameters({
        machineId,
        inspectionId,
        eventType: EventType.CREATE,
      })
      .getOne();
  }

  async getInspectionsForWebapp(
    startTime: string,
    endTime: string,
    customInspectionFormId: string,
    machineId: string,
  ) {
    return this.createQueryBuilder('inspection')
      .innerJoinAndSelect(
        'inspection.inspectionResults',
        'inspectionResults',
        'inspectionResults.currentStatus = :postedStatus',
      )
      .innerJoinAndSelect(
        'inspection.inspectionHistories',
        'inspectionHistories',
        'inspectionHistories.eventType = :createStatus',
      )
      .innerJoinAndSelect('inspectionHistories.user', 'user')
      .leftJoinAndSelect('inspectionResults.machineReport', 'machineReport')
      .where('inspection.machineId = :machineId')
      .andWhere('inspection.customInspectionFormId = :customInspectionFormId')
      .andWhere('inspection.currentStatus = :postedStatus')
      .andWhere('inspection.inspectionAt BETWEEN :startTime AND :endTime')
      .orderBy('inspection.inspectionAt')
      .setParameters({
        startTime,
        endTime,
        customInspectionFormId,
        machineId,
        postedStatus: InspectionCurrentStatus.POSTED,
        createStatus: EventType.CREATE,
      })
      .getMany();
  }

  getInspectionReportQuery(
    machineId: string,
    startTime: string,
    endTime: string,
    reportTypeTitle: string,
    summaryOrders: GetMachineSummaryOrderBy[],
    limitEachReport: number,
  ) {
    const query = this.createQueryBuilder('inspection')
      .select([
        'inspection.inspectionId "reportedId"',
        'inspection.lastStatusUpdatedAt "reportedAt"',
        `'INSPECTION' "reportType"`,
        `N'${reportTypeTitle}' "reportTypeMessage"`,
        'NULL "inspectionResultId"',
        'customInspectionForm.name "reportItem"',
        'NULL "reportResponseStatus"',
        'CAST(inspectionResults.result AS DECIMAL(8,1)) "serviceMeter"',
        'user.givenName "givenName"',
        'user.surname "surname"',
        'user.pictureUrl "userPictureUrl"',
        'inspection.lng "lng"',
        'inspection.lat "lat"',
        'inspection.inspectionAt "firstReportedAt"',
      ])
      .innerJoin('inspection.customInspectionForm', 'customInspectionForm')
      .innerJoin(
        'inspection.inspectionResults',
        'inspectionResults',
        `inspectionResults.itemCode = '${ItemCodeType.SERVICE_METER}'`,
      )
      .innerJoin(
        'inspection.inspectionHistories',
        'inspectionHistories',
        `inspectionHistories.eventType = '${EventType.CREATE}'`,
      )
      .innerJoin('inspectionHistories.user', 'user')
      .where(`inspection.machineId = '${machineId}'`)
      .andWhere(
        `inspection.currentStatus = '${InspectionCurrentStatus.POSTED}'`,
      )
      .andWhere(
        `inspection.lastStatusUpdatedAt BETWEEN '${startTime}' AND '${endTime}'`,
      );

    summaryOrders.forEach((orderBy) =>
      query.addOrderBy(orderBy.field, orderBy.order),
    );

    return query
      .andWhere(`inspectionResults.result != ''`)
      .limit(limitEachReport)
      .getQuery();
  }

  getInspectionReportCountQuery(
    machineId: string,
    startDate: string,
    endDate: string,
  ) {
    return this.createQueryBuilder('inspection')
      .select([`'INSPECTION' "reportType"`, 'COUNT(*) "count"'])
      .where(`inspection.machineId = '${machineId}'`)
      .andWhere(
        `inspection.currentStatus = '${InspectionCurrentStatus.POSTED}'`,
      )
      .andWhere(
        `inspection.lastStatusUpdatedAt BETWEEN '${startDate}' AND '${endDate}'`,
      )
      .getQuery();
  }
}
