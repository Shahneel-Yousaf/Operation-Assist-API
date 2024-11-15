import { Injectable } from '@nestjs/common';
import { OilType } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OilTypeRepository extends Repository<OilType> {
  constructor(private dataSource: DataSource) {
    super(OilType, dataSource.createEntityManager());
  }
}
