import {
  ContentDataNotification,
  UserFcmTokenPushNotification,
} from '@firebase/dtos';
import { NotificationRepository } from '@firebase/repositories';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NotificationContentCode,
  NotificationStatus,
  NotificationType,
} from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { keysToSnakeCase } from '@shared/utils/commons';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import {
  MulticastMessage,
  Notification,
} from 'firebase-admin/lib/messaging/messaging-api';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class FirebaseService {
  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
    private readonly notificationRepository: NotificationRepository,
    private readonly i18n: I18nService,
  ) {
    this.logger.setContext(FirebaseService.name);
    const serviceAccount = {
      projectId: this.configService.get<string>('firebase.projectId'),
      privateKey: this.configService
        .get<string>('firebase.privateKey')
        .replace(/\\n/g, '\n'),
      clientEmail: this.configService.get<string>('firebase.clientEmail'),
    } as ServiceAccount;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  async sendFCMNotification(
    tokens: string[],
    data: Record<string, any>,
    notification: Notification,
  ) {
    const multicastMessage: MulticastMessage = {
      tokens,
      notification,
      data,
      android: { priority: 'high' },
    };

    return admin.messaging().sendEachForMulticast(multicastMessage);
  }

  async createNotifications(
    ctx: RequestContext,
    userTokens: UserFcmTokenPushNotification[],
    data: ContentDataNotification,
    notification: Notification,
    contentCode: NotificationContentCode,
  ) {
    try {
      const tokensChunks = this.chunkArray(userTokens, 500);
      let type: NotificationType;
      switch (contentCode) {
        case NotificationContentCode.INSPECTION_POSTED:
          type = NotificationType.INSPECTION;
          break;
        case NotificationContentCode.MAINTENANCE_REPORT_POSTED:
          type = NotificationType.MAINTENANCE_REPORT;
          break;
        default:
          type = NotificationType.MACHINE_REPORT;
      }

      for (const tokensChunk of tokensChunks) {
        const batchResponse = await this.sendFCMNotification(
          tokensChunk.map(({ fcmToken }) => fcmToken),
          {
            ...data,
            contentCode,
            type,
          },
          notification,
        );

        const timeNow = new Date();
        const contentData = JSON.stringify(keysToSnakeCase(data));

        await this.notificationRepository.insert(
          batchResponse.responses.map((response, index) => ({
            contentCode,
            contentData,
            userId: tokensChunk[index].userId,
            inspectionId: data.inspectionId,
            machineReportResponseId: data.machineReportResponseId,
            sentAt: timeNow,
            status: response.success
              ? NotificationStatus.SENT
              : NotificationStatus.FAILED,
            errorCode: response.error?.code,
          })),
        );
      }
    } catch (error) {
      this.logger.error(ctx, 'Error when create notification', { error });
    }
  }

  private chunkArray(
    arr: Record<string, any>[],
    chunkSize: number,
  ): Record<string, any>[][] {
    return Array.from(
      { length: Math.ceil(arr.length / chunkSize) },
      (_, index) => arr.slice(index * chunkSize, (index + 1) * chunkSize),
    );
  }

  async sendNotificationsByLocalCode(
    ctx: RequestContext,
    groupDevices: Record<string, UserFcmTokenPushNotification[]>,
    data: ContentDataNotification,
    message: string,
    contentCode: NotificationContentCode,
  ) {
    const args = {
      ...data,
      inspectionName: data.customInspectionFormName,
      machineName: data.customerMachineName,
    };

    for (const localCode in groupDevices) {
      const notification = {
        title: this.i18n.t(`${message}.title`, {
          lang: localCode,
          args: { groupName: data.groupName },
        }),
        body: this.i18n.t(`${message}.body`, {
          lang: localCode,
          args,
        }),
      };

      await this.createNotifications(
        ctx,
        groupDevices[localCode],
        data,
        notification,
        contentCode,
      );
    }
  }
}
