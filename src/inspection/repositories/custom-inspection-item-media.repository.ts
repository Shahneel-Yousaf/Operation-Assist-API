import { CustomInspectionItemMedia } from '@inspection/entities';
import { Injectable } from '@nestjs/common';
import {
  CustomInspectionFormCurrentStatus,
  MachineCurrentStatus,
} from '@shared/constants';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomInspectionItemMediaRepository extends Repository<CustomInspectionItemMedia> {
  constructor(private dataSource: DataSource) {
    super(CustomInspectionItemMedia, dataSource.createEntityManager());
  }

  async getCustomInspectionItemMediasInGroup(groupId: string) {
    return this.createQueryBuilder('customInspectionItemMedias')
      .innerJoin(
        'customInspectionItemMedias.customInspectionItem',
        'customInspectionItem',
      )
      .innerJoin(
        'customInspectionItem.customInspectionForm',
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
      .getMany();
  }
}
