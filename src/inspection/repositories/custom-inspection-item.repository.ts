import { CustomInspectionItem } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import {
  CustomInspectionFormCurrentStatus,
  MachineCurrentStatus,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomInspectionItemRepository extends Repository<CustomInspectionItem> {
  constructor(private dataSource: DataSource) {
    super(CustomInspectionItem, dataSource.createEntityManager());
  }

  async getCustomInspectionItemsInGroup(groupId: string) {
    return this.createQueryBuilder('customInspectionItems')
      .select([
        'customInspectionItems.customInspectionItemId AS customInspectionItemId',
        'customInspectionItems.customInspectionFormId AS customInspectionFormId',
        'customInspectionItems.name AS name',
        'customInspectionItems.description AS description',
        'customInspectionItems.resultType AS resultType',
        'customInspectionItems.itemCode AS itemCode',
        'customInspectionItems.position AS position',
        'customInspectionItems.isRequired AS isRequired',
        'customInspectionItems.isForcedRequired AS isForcedRequired',
        'customInspectionItems.isImmutable AS isImmutable',
        'customInspectionItems.lastStatusUpdatedAt AS lastStatusUpdatedAt',
      ])
      .innerJoin(
        'customInspectionItems.customInspectionForm',
        'customInspectionForm',
      )
      .innerJoin('customInspectionForm.machine', 'machine')
      .where(
        'machine.groupId = :groupId AND customInspectionForm.currentStatus = :currentStatus AND machine.currentStatus != :machineCurrentStatus',
      )
      .setParameters({
        groupId,
        currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
        machineCurrentStatus: MachineCurrentStatus.DELETED,
      })
      .getRawMany();
  }
}
