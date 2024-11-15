import { Notification } from '@firebase/entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }
}
