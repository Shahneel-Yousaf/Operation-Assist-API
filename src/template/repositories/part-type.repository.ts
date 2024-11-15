import { Injectable } from '@nestjs/common';
import { PartType } from '@template/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PartTypeRepository extends Repository<PartType> {
  constructor(private dataSource: DataSource) {
    super(PartType, dataSource.createEntityManager());
  }
}
