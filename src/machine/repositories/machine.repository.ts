import { GetMachineInGroupWebappOrderBy } from '@group/dtos';
import { Machine, MachineManufacturer, MachineType } from '@machine/entities';
import { Injectable } from '@nestjs/common';
import {
  ESCAPE_CHAR,
  GroupMachineCondition,
  ISOLocaleCode,
  MachineCurrentStatus,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  MachineSortByField,
  Order,
  Subtype,
} from '@shared/constants';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class MachineRepository extends Repository<Machine> {
  constructor(private dataSource: DataSource) {
    super(Machine, dataSource.createEntityManager());
  }

  async getMachinesInGroup(
    groupId: string,
    userId: string,
    isoLocaleCode: ISOLocaleCode,
  ) {
    return this.createQueryBuilder('machines')
      .select([
        'machines.groupId as groupId',
        'machines.machineId as machineId',
        'machines.machineName as machineName',
        'machines.pictureUrl as pictureUrl',
        'machines.modelAndType as modelAndType',
        'machines.serialNumber as serialNumber',
        'machines.serialNumberPlatePictureUrl as serialNumberPlatePictureUrl',
        'machines.customMachineManufacturerName as customMachineManufacturerName',
        'machines.customTypeName as customTypeName',
        'machineManufacturer.machineManufacturerName as machineManufacturerName',
        'machineTypeTranslation.typeName as machineTypeName',
        'machineType.pictureUrl as machineTypePictureUrl',
        'userGroupMachineFavorites.userId as userId',
        'groupMachineCondition.machineCondition as machineCondition',
      ])
      .innerJoin('machines.machineType', 'machineType')
      .innerJoin(
        'machineType.machineTypeTranslation',
        'machineTypeTranslation',
        'machineTypeTranslation.isoLocaleCode= :isoLocaleCode',
      )
      .innerJoin('machines.machineManufacturer', 'machineManufacturer')
      .innerJoin('machines.groupMachineCondition', 'groupMachineCondition')
      .leftJoin(
        'machines.userGroupMachineFavorites',
        'userGroupMachineFavorites',
        'userGroupMachineFavorites.groupId = :groupId AND userGroupMachineFavorites.userId = :userId',
      )
      .where('machines.groupId = :groupId')
      .andWhere('machines.currentStatus != :machineCurrentStatus')
      .orderBy('machines.customer_machine_name')
      .setParameters({
        groupId,
        userId,
        isoLocaleCode,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .getRawMany();
  }

  async countMachineReport(groupId: string) {
    return this.createQueryBuilder('machines')
      .select([
        'machines.machineId as machineId',
        'COUNT(lastMachineReportResponse.machineReportId) as machineReportCount',
      ])
      .innerJoin(
        'machines.machineReports',
        'machineReports',
        'machineReports.currentStatus != :machineReportCurrentStatus',
      )
      .innerJoin(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
        'lastMachineReportResponse.status = :status',
      )
      .where('machines.groupId = :groupId')
      .andWhere('machines.currentStatus != :machineCurrentStatus')
      .groupBy('machines.machineId')
      .setParameters({
        groupId,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
        machineReportCurrentStatus: MachineReportCurrentStatus.DRAFT,
        status: MachineReportResponseStatus.UNADDRESSED,
      })
      .getRawMany();
  }

  async getMachinesByMachineIds(machineIds: string[], groupId: string) {
    return this.createQueryBuilder('machines')
      .select([
        'machines.machineId AS machineId',
        'machines.machineName AS machineName',
        'machines.machineTypeId AS machineTypeId',
        'machines.pictureUrl AS pictureUrl',
        'machines.machineManufacturerId AS machineManufacturerId',
        'machines.modelAndType AS modelAndType',
        'machines.serialNumber AS serialNumber',
        'machines.serialNumberPlatePictureUrl AS serialNumberPlatePictureUrl',
        'machines.currentStatus AS currentStatus',
        'machines.customMachineManufacturerName AS customMachineManufacturerName',
        'machines.customTypeName AS customTypeName',
        'machines.groupId AS groupId',
        'count(subMachine.machineId) AS count',
      ])
      .leftJoin(
        Machine,
        'subMachine',
        'machines.serialNumber = subMachine.serialNumber AND machines.modelAndType = subMachine.modelAndType AND subMachine.groupId = :groupId AND subMachine.currentStatus != :machineCurrentStatus',
      )
      .where('machines.machineId IN(:...machineIds)')
      .groupBy(
        `
        machines.machineId, machines.machineName, machines.machineTypeId, machines.pictureUrl, 
        machines.machineManufacturerId, machines.modelAndType, machines.serialNumber, machines.serialNumberPlatePictureUrl, 
        machines.currentStatus, machines.customMachineManufacturerName, machines.customTypeName, machines.groupId
        `,
      )
      .setParameters({
        machineIds,
        groupId,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .getRawMany();
  }

  async getMachineDetailInfo(
    userId: string,
    groupId: string,
    machineId: string,
    isoLocaleCode: ISOLocaleCode,
  ) {
    return this.createQueryBuilder('machines')
      .innerJoinAndSelect('machines.machineType', 'machineType')
      .innerJoinAndSelect(
        'machineType.machineTypeTranslation',
        'machineTypeTranslation',
        'machineTypeTranslation.isoLocaleCode= :isoLocaleCode',
      )
      .innerJoinAndSelect('machines.machineManufacturer', 'machineManufacturer')
      .innerJoinAndSelect(
        'machines.groupMachineCondition',
        'groupMachineCondition',
      )
      .leftJoinAndSelect(
        'machines.userGroupMachineFavorites',
        'userGroupMachineFavorites',
        'userGroupMachineFavorites.groupId = :groupId AND userGroupMachineFavorites.userId = :userId ',
      )
      .where('machines.machine_id = :machineId')
      .andWhere('machines.groupId = :groupId')
      .setParameters({
        groupId,
        userId,
        machineId,
        isoLocaleCode,
      })
      .getOne();
  }

  async checkMachineExistsInGroup(
    groupId: string,
    serialNumber: string,
    modelAndType: string,
  ) {
    return this.createQueryBuilder('machines')
      .innerJoin(
        'machines.groupMachineAssignments',
        'groupMachineAssignments',
        'groupMachineAssignments.groupId = :groupId',
      )
      .where('machines.serialNumber = :serialNumber')
      .andWhere('machines.modelAndType = :modelAndType')
      .setParameters({ groupId, serialNumber, modelAndType })
      .getOne();
  }

  async getMachineInGroup(
    groupId: string,
    serialNumber: string,
    modelAndType: string,
  ) {
    return this.createQueryBuilder('machines')
      .where('machines.groupId = :groupId')
      .andWhere('machines.serialNumber = :serialNumber')
      .andWhere('machines.modelAndType = :modelAndType')
      .andWhere('machines.currentStatus != :currentStatus')
      .setParameters({
        groupId,
        serialNumber,
        modelAndType,
        currentStatus: MachineCurrentStatus.DELETED,
      })
      .getOne();
  }

  async getMachineInGroupById(groupId: string, machineId: string) {
    return this.createQueryBuilder('machines')
      .where('machines.machineId = :machineId')
      .andWhere('machines.groupId = :groupId')
      .setParameters({
        groupId,
        machineId,
      })
      .getOne();
  }

  async getMachineReportById(machineId: string, machineReportId: string) {
    return this.createQueryBuilder('machines')
      .innerJoin(
        'machines.machineReports',
        'machineReports',
        'machineReports.machineReportId = :machineReportId',
      )
      .where('machines.machineId = :machineId')
      .andWhere('machines.currentStatus != :currentStatus')
      .setParameters({
        machineId,
        machineReportId,
        currentStatus: MachineCurrentStatus.DELETED,
      })
      .getOne();
  }

  async getMachinesInGroupForWebapp(
    groupId: string,
    isoLocaleCode: ISOLocaleCode,
    offset: number,
    limit: number,
    orderBys: GetMachineInGroupWebappOrderBy[],
    machineCondition: GroupMachineCondition,
  ) {
    const machines = this.createQueryBuilder('machines')
      .select([
        'machines.machineId "machineId"',
        'machines.pictureUrl "pictureUrl"',
        'machines.machineName "machineName"',
        'groupMachineCondition.machineCondition "machineCondition"',
        'machines.modelAndType "modelAndType"',
        'machines.serialNumber "serialNumber"',
        'machines.lastServiceMeter "serviceMeter"',
        'machineType.pictureUrl "machineTypePictureUrl"',
        'machines.customMachineManufacturerName "customMachineManufacturerName"',
        'machines.customTypeName "customTypeName"',
        'machines.serialNumberPlatePictureUrl "serialNumberPlatePictureUrl"',
      ])
      .innerJoin('machines.groupMachineCondition', 'groupMachineCondition')
      .innerJoin('machines.machineType', 'machineType')
      .innerJoin(
        'machineType.machineTypeTranslation',
        'machineTypeTranslation',
        'machineTypeTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .innerJoin('machines.machineManufacturer', 'machineManufacturer');

    if (limit) {
      machines.limit(limit);
    }

    const [orderBy] = orderBys?.length
      ? orderBys
      : [{ field: 'machineName', order: Order.ASC }];

    if (orderBy.field === MachineSortByField.MACHINE_MANUFACTURER_NAME) {
      machines.addSelect([
        `CASE 
          WHEN machines.customMachineManufacturerName IS NULL OR machines.customMachineManufacturerName = '' 
          THEN machineManufacturer.machineManufacturerName 
          ELSE machines.customMachineManufacturerName 
        END "machineManufacturerName"`,
      ]);
    } else {
      machines.addSelect([
        'machineManufacturer.machineManufacturerName "machineManufacturerName"',
      ]);
    }

    if (orderBy.field === MachineSortByField.MACHINE_TYPE) {
      machines.addSelect([
        `CASE
          WHEN machines.customTypeName IS NULL OR machines.customTypeName = '' 
          THEN machineTypeTranslation.typeName 
          ELSE machines.customTypeName 
        END "machineType"`,
      ]);
    } else {
      machines.addSelect(['machineTypeTranslation.typeName "machineType"']);
    }

    if (machineCondition) {
      machines.andWhere(
        'groupMachineCondition.machineCondition = :machineCondition',
      );
    }

    return machines
      .andWhere('machines.groupId = :groupId')
      .andWhere('machines.currentStatus != :deletedStatus')
      .orderBy(orderBy.field, orderBy.order)
      .addOrderBy('machines.machineId', orderBy.order)
      .offset(offset)
      .setParameters({
        groupId,
        isoLocaleCode,
        unaddressedStatus: MachineReportResponseStatus.UNADDRESSED,
        machineCondition,
        deletedStatus: MachineCurrentStatus.DELETED,
        draftStatus: MachineReportCurrentStatus.DRAFT,
      })
      .getRawMany();
  }

  async countMachineReportForWebapp(machineIds: string[]) {
    return this.createQueryBuilder('machines')
      .select([
        'machines.machineId "machineId"',
        'COUNT(machineReports.machineReportId) "reportCount"',
        'COUNT(lastMachineReportResponse.machineReportResponseId) "reportOpenCount"',
      ])
      .innerJoin(
        'machines.machineReports',
        'machineReports',
        'machineReports.currentStatus <> :draftStatus',
      )
      .innerJoin(
        'machineReports.firstMachineReportResponse',
        'firstMachineReportResponse',
        '(firstMachineReportResponse.subType = :incidentReport OR firstMachineReportResponse.subType = :maintenanceReports)',
      )
      .leftJoin(
        'machineReports.lastMachineReportResponse',
        'lastMachineReportResponse',
        'lastMachineReportResponse.status = :unaddressedStatus',
      )
      .andWhere('machines.machineId IN (:...machineIds)')
      .groupBy('machines.machineId')
      .setParameters({
        machineIds,
        unaddressedStatus: MachineReportResponseStatus.UNADDRESSED,
        draftStatus: MachineReportCurrentStatus.DRAFT,
        incidentReport: Subtype.INCIDENT_REPORTS,
        maintenanceReports: Subtype.MAINTENANCE_REPORTS,
      })
      .getRawMany();
  }

  async countMachinesInGroupForWebapp(
    machineCondition: GroupMachineCondition,
    groupId: string,
  ) {
    const machines = this.createQueryBuilder('machines').innerJoin(
      'machines.groupMachineCondition',
      'groupMachineCondition',
    );

    if (machineCondition) {
      machines.where(
        'groupMachineCondition.machineCondition = :machineCondition',
      );
    }

    return machines
      .andWhere('machines.groupId = :groupId')
      .andWhere('machines.currentStatus != :deletedStatus')
      .setParameters({
        groupId,
        machineCondition,
        deletedStatus: MachineCurrentStatus.DELETED,
      })
      .getCount();
  }

  async getGroupMachineConditionDetail(groupId: string) {
    return this.createQueryBuilder('machine')
      .select([
        'COUNT(machineCondition.machineId) "machineCount"',
        `COUNT(
          DISTINCT 
            CASE 
              WHEN machineCondition.machineCondition = :statusNormal 
              THEN machineCondition.machineId 
              ELSE NULL 
            END
        ) "normalStatusCount"`,
        `COUNT(
          DISTINCT 
            CASE 
              WHEN machineCondition.machineCondition = :statusWarning 
              THEN machineCondition.machineId 
              ELSE NULL 
            END
        ) "warningStatusCount"`,
        `COUNT(
          DISTINCT 
            CASE 
              WHEN machineCondition.machineCondition = :statusError 
              THEN machineCondition.machineId 
              ELSE NULL 
            END
        ) "errorStatusCount"`,
      ])
      .innerJoin('machine.groupMachineCondition', 'machineCondition')
      .where('machine.groupId = :groupId')
      .andWhere('machine.currentStatus != :deletedStatus')
      .setParameters({
        groupId,
        statusNormal: GroupMachineCondition.NORMAL,
        statusWarning: GroupMachineCondition.WARNING,
        statusError: GroupMachineCondition.ERROR,
        deletedStatus: MachineCurrentStatus.DELETED,
      })
      .getRawOne();
  }

  async groupMachineSuggestions(
    groupId: string,
    userId: string,
    search: string,
    limit: number,
  ) {
    const query = this.dataSource
      .createQueryBuilder()
      .select([
        'machines.machineId "machineId"',
        'machines.machineName "machineName"',
        'machines.pictureUrl "pictureUrl"',
        'machines.modelAndType "modelAndType"',
        'machineType.pictureUrl "machineTypePictureUrl"',
        'machines.eventAt "eventAt"',
        'machines.customMachineManufacturerName "customMachineManufacturerName"',
        'machineManufacturer.machineManufacturerName "machineManufacturerName"',
        'machines.groupId "groupId"',
      ])
      .from(
        (subQuery) => this.groupMachineSuggestionSubQuery(subQuery, search),
        'machines',
      )
      .innerJoin(
        MachineType,
        'machineType',
        'machines.machineTypeId = machineType.machineTypeId',
      )
      .innerJoin(
        MachineManufacturer,
        'machineManufacturer',
        'machines.machineManufacturerId = machineManufacturer.machineManufacturerId',
      )
      .where('machines.rowNum = 1');

    if (search) {
      query.orderBy('machines.machineName');
    } else {
      query
        .leftJoin(
          Machine,
          'machinesInGroup',
          `(
            machinesInGroup.groupId = :groupId
            AND machinesInGroup.serialNumber = machines.serialNumber 
            AND machinesInGroup.modelAndType = machines.modelAndType
            AND machinesInGroup.currentStatus != :statusDeleted
          )`,
        )
        .andWhere('machinesInGroup.machineId is NULL')
        .orderBy('machines.eventAt', 'DESC')
        .limit(limit);
    }

    return query
      .distinct(true)
      .setParameters({
        userId,
        statusDeleted: MachineCurrentStatus.DELETED,
        statusCreated: MachineCurrentStatus.CREATED,
        groupId,
        search: `%${search}%`,
        escapeChar: ESCAPE_CHAR,
      })
      .getRawMany();
  }

  groupMachineSuggestionSubQuery(
    subQuery: SelectQueryBuilder<any>,
    search: string,
  ) {
    return subQuery
      .select([
        'machines.machineId "machineId"',
        'machines.machineName "machineName"',
        'machines.pictureUrl "pictureUrl"',
        'machines.modelAndType "modelAndType"',
        'machines.serialNumber "serialNumber"',
        'machineHistories.eventAt "eventAt"',
        'machines.customMachineManufacturerName "customMachineManufacturerName"',
        'machines.groupId "groupId"',
        'ROW_NUMBER() OVER(PARTITION BY machines.modelAndType, machines.serialNumber ORDER BY machineHistories.eventAt DESC) AS rowNum',
        'machines.machineTypeId "machineTypeId"',
        'machines.machineManufacturerId "machineManufacturerId"',
      ])
      .from(Machine, 'machines')
      .innerJoin(
        'machines.machineHistories',
        'machineHistories',
        `(
        machineHistories.actionedByUserId = :userId
        AND machineHistories.currentStatus = :statusCreated
        ${
          search
            ? ' AND machines.machineName LIKE :search ESCAPE :escapeChar'
            : ''
        }
      )`,
      )
      .where('machines.currentStatus != :statusDeleted');
  }

  async getMachineFieldsInGroup(groupId: string, field: string[]) {
    return this.createQueryBuilder('machines')
      .select(field)
      .where('machines.groupId = :groupId')
      .andWhere('machines.currentStatus != :deletedStatus')
      .orderBy('machines.machineName')
      .setParameters({
        groupId,
        deletedStatus: MachineCurrentStatus.DELETED,
      })
      .getRawMany();
  }
}
