import { Injectable } from '@nestjs/common';
import { UserSetting } from '@user/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserSettingRepository extends Repository<UserSetting> {
  constructor(private dataSource: DataSource) {
    super(UserSetting, dataSource.createEntityManager());
  }
}
