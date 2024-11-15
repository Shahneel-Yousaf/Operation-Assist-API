import { MachineManufacturer } from '@machine/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MachineManufacturerRepository extends Repository<MachineManufacturer> {
  constructor(private dataSource: DataSource) {
    super(MachineManufacturer, dataSource.createEntityManager());
  }
}
