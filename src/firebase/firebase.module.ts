import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';

import { Notification } from './entities';
import { NotificationRepository } from './repositories';
import { FirebaseService } from './services/firebase.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Notification])],
  providers: [FirebaseService, NotificationRepository],
  exports: [FirebaseService],
})
export class FirebaseModule {}
