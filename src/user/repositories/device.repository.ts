import { Injectable } from '@nestjs/common';
import { Device } from '@user/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  constructor(private dataSource: DataSource) {
    super(Device, dataSource.createEntityManager());
  }
}
