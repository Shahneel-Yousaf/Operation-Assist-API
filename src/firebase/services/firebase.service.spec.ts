import { NotificationRepository } from '@firebase/repositories';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode, NotificationContentCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { I18nService } from 'nestjs-i18n';

import { FirebaseService } from './firebase.service';

jest.mock('../../shared/utils/commons.ts');
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn().mockReturnValue({}),
  credential: {
    cert: jest.fn().mockReturnValue({}),
  },
  messaging: jest.fn(() => ({
    sendMulticast: jest.fn(),
    sendEachForMulticast: jest.fn(),
  })),
  admin: {
    messaging: {
      sendMulticast: jest.fn(),
      sendEachForMulticast: jest.fn(),
    },
  },
}));
describe('FirebaseService', () => {
  let service: FirebaseService;

  const mockedNotificationRepository = {
    insert: jest.fn(),
  };

  const mockI18n = { t: jest.fn() };
  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.userId = userId;
  ctx.user.isoLocaleCode = ISOLocaleCode.EN;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebaseService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return 'mock';
            }),
          },
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn(), error: jest.fn() },
        },
        {
          provide: NotificationRepository,
          useValue: mockedNotificationRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18n,
        },
      ],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send FCM notification', async () => {
    const tokens = ['token1', 'token2'];
    const data = { key: 'value' };
    const notification = { title: 'Title', body: 'Body' };

    jest.spyOn(service, 'sendFCMNotification').mockResolvedValue(undefined);

    await service.sendFCMNotification(tokens, data, notification);

    expect(service.sendFCMNotification).toHaveBeenCalledWith(
      tokens,
      data,
      notification,
    );
  });

  it('should create notifications successfully', async () => {
    const userTokens = [
      { fcmToken: 'token1', userId: 'user1' },
      { fcmToken: 'token2', userId: 'user2' },
    ];
    const contentCode = NotificationContentCode.INSPECTION_POSTED;
    const data = { key: 'value', contentCode, type: 'INSPECTION' } as any;
    const notification = { title: 'Title', body: 'Body' };

    const mockSendFCMNotification = jest.fn().mockResolvedValue({
      responses: [
        { success: true, error: null },
        { success: false, error: { code: 'someErrorCode' } },
      ],
    });

    jest
      .spyOn(service, 'sendFCMNotification')
      .mockImplementation(mockSendFCMNotification);

    mockedNotificationRepository.insert.mockResolvedValue({});

    await service.createNotifications(
      ctx,
      userTokens,
      data,
      notification,
      contentCode,
    );

    expect(mockSendFCMNotification).toHaveBeenCalledWith(
      userTokens.map(({ fcmToken }) => fcmToken),
      data,
      notification,
    );
  });

  it('sendNotificationsByLocalCode success', async () => {
    const groupDevices = {
      ja: [
        { userId: 'id', fcmToken: 'token' },
        { userId: 'id2', fcmToken: 'token2' },
      ],
      en: [
        { userId: 'id3', fcmToken: 'token3' },
        { userId: 'id4', fcmToken: 'token4' },
      ],
    };
    const groupDevicesLocalCode = [
      { userId: 'id', fcmToken: 'token' },
      { userId: 'id2', fcmToken: 'token2' },
    ];
    const data = { key: 'value' } as any;
    const message = 'message';
    const notification = {
      title: mockI18n.t(`${message}.title`),
      body: mockI18n.t(`${message}.body`),
    };
    const contentCode = NotificationContentCode.INSPECTION_POSTED;

    const mockCreateNotifications = jest.fn().mockResolvedValue({});

    jest
      .spyOn(service, 'createNotifications')
      .mockImplementation(mockCreateNotifications);

    await service.sendNotificationsByLocalCode(
      ctx,
      groupDevices,
      data,
      message,
      contentCode,
    );

    expect(mockCreateNotifications).toHaveBeenCalledWith(
      ctx,
      groupDevicesLocalCode,
      data,
      notification,
      contentCode,
    );
  });
});
