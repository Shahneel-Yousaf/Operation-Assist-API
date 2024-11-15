import { Injectable } from '@nestjs/common';
import { UserCiamLink } from '@user/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserCiamLinkRepository extends Repository<UserCiamLink> {
  constructor(private dataSource: DataSource) {
    super(UserCiamLink, dataSource.createEntityManager());
  }
}
