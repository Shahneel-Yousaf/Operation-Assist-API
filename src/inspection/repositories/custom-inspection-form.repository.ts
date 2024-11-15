import { GetGroupInspectionFormOrderBy } from '@group/dtos';
import {
  CustomInspectionForm,
  CustomInspectionFormHistory,
} from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import {
  CustomInspectionFormCurrentStatus,
  EventType,
  GroupInspectionFormSortByField,
  ISOLocaleCode,
  MachineCurrentStatus,
  Order,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomInspectionFormRepository extends Repository<CustomInspectionForm> {
  constructor(private dataSource: DataSource) {
    super(CustomInspectionForm, dataSource.createEntityManager());
  }
  async getInspectionFormsInGroup(groupId: string) {
    return this.createQueryBuilder('customInspectionForm')
      .select([
        'customInspectionForm.customInspectionFormId',
        'customInspectionForm.name',
        'customInspectionForm.machineId',
        'customInspectionForm.lastStatusUpdatedAt',
      ])
      .innerJoin('customInspectionForm.machine', 'machine')
      .where(
        'machine.groupId = :groupId AND customInspectionForm.currentStatus = :currentStatus AND machine.currentStatus != :machineCurrentStatus',
      )
      .setParameters({
        groupId,
        currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .orderBy('customInspectionForm.name')
      .getMany();
  }

  async getInspectionItems(customInspectionFormId: string) {
    return this.createQueryBuilder('customInspectionForm')
      .innerJoinAndSelect(
        'customInspectionForm.customInspectionItems',
        'customInspectionItems',
      )
      .leftJoinAndSelect(
        'customInspectionItems.customInspectionItemMedias',
        'customInspectionItemMedias',
      )
      .where(
        'customInspectionItems.customInspectionFormId = :customInspectionFormId',
      )
      .setParameters({
        customInspectionFormId,
      })
      .orderBy('customInspectionItems.position')
      .getOne();
  }

  async countGroupInspectionFormStatus(userId: string, groupId: string) {
    return this.createQueryBuilder('customInspectionForm')
      .select([
        'COUNT(customInspectionForm.machineId) "inspectionFormCount"',
        `COUNT(
          CASE WHEN customInspectionForm.currentStatus = :publishedStatus THEN 1 ELSE NULL END
        ) "publishedStatusCount"`,
      ])
      .innerJoin(
        'customInspectionForm.machine',
        'machine',
        'machine.groupId = :groupId and machine.currentStatus <> :deletedMachineStatus',
      )
      .innerJoin(
        'customInspectionForm.customInspectionFormHistories',
        'customInspectionFormHistories',
        'customInspectionFormHistories.eventType = :eventType',
      )
      .where(
        `(
          customInspectionForm.currentStatus = :publishedStatus OR 
          (customInspectionForm.currentStatus = :draftStatus AND customInspectionFormHistories.actionedByUserId = :userId)
        )`,
      )
      .setParameters({
        userId,
        groupId,
        eventType: EventType.CREATE,
        publishedStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        draftStatus: CustomInspectionFormCurrentStatus.DRAFT,
        deletedStatus: CustomInspectionFormCurrentStatus.DELETED,
        deletedMachineStatus: MachineCurrentStatus.DELETED,
      })
      .getRawOne();
  }

  async countGroupInspectionForms(
    groupId: string,
    userId: string,
    currentStatus: CustomInspectionFormCurrentStatus,
  ) {
    const query = this.createQueryBuilder('customInspectionForms')
      .innerJoin(
        'customInspectionForms.machine',
        'machine',
        `machine.groupId = :groupId AND machine.currentStatus != :deletedStatus`,
      )
      .innerJoin(
        'customInspectionForms.customInspectionFormHistories',
        'customInspectionFormHistories',
        'customInspectionFormHistories.eventType = :createStatus',
      )
      .where(
        `(
          customInspectionForms.currentStatus = :publishedStatus OR 
          (customInspectionForms.currentStatus = :draftStatus AND customInspectionFormHistories.actionedByUserId = :userId)
        )`,
      );

    if (currentStatus) {
      query.andWhere('customInspectionForms.currentStatus = :currentStatus');
    }

    return query
      .setParameters({
        userId,
        groupId,
        currentStatus,
        draftStatus: CustomInspectionFormCurrentStatus.DRAFT,
        deletedStatus: CustomInspectionFormCurrentStatus.DELETED,
        createStatus: EventType.CREATE,
        publishedStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
      })
      .getCount();
  }

  async getGroupInspectionForms(
    groupId: string,
    userId: string,
    orderBys: GetGroupInspectionFormOrderBy[],
    limit: number,
    offset: number,
    currentStatus: CustomInspectionFormCurrentStatus,
  ) {
    const query = this.createQueryBuilder('customInspectionForms')
      .select([
        'machine.machineId "machineId"',
        'customInspectionForms.customInspectionFormId "inspectionFormId"',
        'machine.pictureUrl "machinePictureUrl"',
        'machineType.pictureUrl "machineTypePictureUrl"',
        'machine.machineName "machineName"',
        'customInspectionForms.name "inspectionFormName"',
        'customInspectionForms.currentStatus "currentStatus"',
        'customInspectionForms.lastStatusUpdatedAt  "lastStatusUpdatedAt"',
        'lastCustomInspectionFormHistory.surname "surname"',
        'lastCustomInspectionFormHistory.givenName "givenName"',
        'lastCustomInspectionFormHistory.userPictureUrl "userPictureUrl"',
      ])
      .innerJoin(
        'customInspectionForms.machine',
        'machine',
        `machine.groupId = :groupId AND machine.currentStatus != :deletedStatus`,
      )
      .innerJoin('machine.machineType', 'machineType')
      .innerJoin(
        'customInspectionForms.customInspectionFormHistories',
        'customInspectionFormHistories',
        'customInspectionFormHistories.eventType = :createStatus',
      )
      .leftJoin(
        (subQuery) =>
          subQuery
            .select([
              'user.surname "surname"',
              'user.givenName "givenName"',
              'user.pictureUrl "userPictureUrl"',
              'ROW_NUMBER() OVER(PARTITION BY lastCustomInspectionFormHistory.customInspectionFormId ORDER BY lastCustomInspectionFormHistory.eventAt DESC) AS rowNum',
              'lastCustomInspectionFormHistory.customInspectionFormId "customInspectionFormId"',
            ])
            .from(
              CustomInspectionFormHistory,
              'lastCustomInspectionFormHistory',
            )
            .innerJoin('lastCustomInspectionFormHistory.user', 'user'),
        'lastCustomInspectionFormHistory',
        'customInspectionForms.customInspectionFormId = lastCustomInspectionFormHistory.customInspectionFormId',
      )
      .where(
        `(
          customInspectionForms.currentStatus = :publishedStatus OR 
          (customInspectionForms.currentStatus = :draftStatus AND customInspectionFormHistories.actionedByUserId = :userId)
        )`,
      )
      .andWhere('lastCustomInspectionFormHistory.rowNum = 1');

    if (currentStatus) {
      query.andWhere('customInspectionForms.currentStatus = :currentStatus');
    }

    if (limit) {
      query.limit(limit);
    }

    if (orderBys?.length) {
      orderBys.forEach((orderBy) => {
        if (orderBy.field === GroupInspectionFormSortByField.UPDATED_BY) {
          query
            .addOrderBy(
              'lastCustomInspectionFormHistory.surName',
              orderBy.order,
            )
            .addOrderBy(
              'lastCustomInspectionFormHistory.givenName',
              orderBy.order,
            );
        } else {
          query.addOrderBy(orderBy.field, orderBy.order);
        }
      });
    } else {
      query
        .orderBy('machine.machineName', Order.ASC)
        .addOrderBy('customInspectionForms.name', Order.ASC);
    }

    return query
      .addOrderBy(
        'customInspectionForms.customInspectionFormId',
        orderBys?.pop().order ?? Order.ASC,
      )
      .offset(offset)
      .setParameters({
        userId,
        groupId,
        publishedStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        draftStatus: CustomInspectionFormCurrentStatus.DRAFT,
        deletedStatus: CustomInspectionFormCurrentStatus.DELETED,
        createStatus: EventType.CREATE,
        currentStatus,
      })
      .getRawMany();
  }

  async getInspectionForm(
    groupId: string,
    machineId: string,
    customInspectionFormId: string,
    isoLocaleCode: ISOLocaleCode,
  ) {
    return this.createQueryBuilder('customInspectionForm')
      .select([
        'customInspectionForm.name as inspectionFormName',
        'group.groupName as groupName',
        'machine.machineName as machineName',
        'machine.modelAndType as modelAndType',
        'machine.serialNumber as serialNumber',
        'machine.customMachineManufacturerName as customMachineManufacturerName',
        'machine.customTypeName as customTypeName',
        'machineManufacturer.machineManufacturerName as machineManufacturerName',
        'machineTypeTranslation.typeName "machineType"',
      ])
      .innerJoin(
        'customInspectionForm.machine',
        'machine',
        'machine.machineId = :machineId',
      )
      .innerJoin('machine.machineManufacturer', 'machineManufacturer')
      .innerJoin('machine.machineType', 'machineType')
      .innerJoin(
        'machineType.machineTypeTranslation',
        'machineTypeTranslation',
        'machineTypeTranslation.isoLocaleCode = :isoLocaleCode',
      )
      .innerJoin('machine.group', 'group', 'group.groupId = :groupId')
      .where(
        'customInspectionForm.customInspectionFormId = :customInspectionFormId',
      )
      .andWhere('customInspectionForm.currentStatus = :currentStatus')
      .setParameters({
        groupId,
        machineId,
        isoLocaleCode,
        customInspectionFormId,
        currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .getRawOne();
  }

  async getCustomInspectionForm(
    customInspectionFormId: string,
    machineId: string,
  ) {
    return this.createQueryBuilder('customInspectionForm')
      .innerJoinAndSelect(
        'customInspectionForm.customInspectionItems',
        'customInspectionItems',
      )
      .where(
        'customInspectionForm.customInspectionFormId = :customInspectionFormId',
      )
      .andWhere('customInspectionForm.machineId = :machineId')
      .andWhere('customInspectionForm.currentStatus <> :draftStatus')
      .orderBy('customInspectionItems.position')
      .setParameters({
        customInspectionFormId,
        machineId,
        draftStatus: CustomInspectionFormCurrentStatus.DRAFT,
      })
      .getOne();
  }
}
