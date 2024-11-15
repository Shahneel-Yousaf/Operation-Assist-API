import { Injectable } from '@nestjs/common';
import { UserGroupSetting } from '@user/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserGroupSettingRepository extends Repository<UserGroupSetting> {
  constructor(private dataSource: DataSource) {
    super(UserGroupSetting, dataSource.createEntityManager());
  }
}
