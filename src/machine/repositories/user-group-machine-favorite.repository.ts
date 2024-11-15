import { UserGroupMachineFavorite } from '@machine/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserGroupMachineFavoriteRepository extends Repository<UserGroupMachineFavorite> {
  constructor(private dataSource: DataSource) {
    super(UserGroupMachineFavorite, dataSource.createEntityManager());
  }
}
