import { MachineType } from '@machine/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MachineTypeRepository extends Repository<MachineType> {
  constructor(private dataSource: DataSource) {
    super(MachineType, dataSource.createEntityManager());
  }

  async getMachineTypes(isoLocaleCode: string) {
    return this.createQueryBuilder('machineTypes')
      .innerJoinAndSelect(
        'machineTypes.machineTypeTranslations',
        'machineTypeTranslations',
        'machineTypeTranslations.isoLocaleCode = :isoLocaleCode',
      )
      .setParameters({ isoLocaleCode })
      .getMany();
  }
}
