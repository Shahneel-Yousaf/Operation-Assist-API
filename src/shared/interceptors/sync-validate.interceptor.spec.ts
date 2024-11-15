import { ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GroupCurrentStatus, MachineCurrentStatus } from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';

import { SyncValidateInterceptor } from './sync-validate.interceptor';

jest.mock('../utils/commons');
describe('SyncValidateInterceptor', () => {
  let interceptor: SyncValidateInterceptor;
  const mockedUserGroupAssignmentRepository = {
    checkPermissionInGroupSyncData: jest.fn(),
  };
  const mockUserRepository = {
    getUserDevicesInGroup: jest.fn(),
    getUserByCiam: jest.fn(),
  };
  const mockGroupRepository = {
    getGroupRelationships: jest.fn(),
  };

  const mockUserCiamLinkRepository = {
    userCiamLinkRepository: jest.fn(),
    update: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };
  const mockUser = {
    userId: '01HK6T59RA54XRCP4Y0XXDS1GJ',
    searchId: '963918311',
    givenName: 'datbui',
    surname: 'dat',
    pictureUrl: 'string',
    email:
      'sdnv1@gmail.com_deleted_at_1708573661_deleted_at_1708573686_deleted_at_1708573734',
    isSearchableByEmail: true,
    registeredAt: '2024-01-03T04:43:58.000Z',
    isoLocaleCode: 'ja',
    residenceCountryCode: 'JP',
    dateOfBirth: '2024',
    currentStatus: 'CREATED',
    lastStatusUpdatedAt: '2025-02-22T03:48:54.000Z',
    userCiamLinks: [
      {
        ciamEmail: 'sdnv1@gmail.com',
      },
    ],
  };
  const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const machineId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const context = {
    getHandler: jest.fn(() => {}),
    getRequest: jest.fn().mockReturnThis(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        params: { groupId, machineId },
        claim: {},
        headers: {},
        body: {},
      }),
    }),
  } as unknown as ExecutionContext;
  context.switchToHttp().getRequest().headers['x-lang'] = 'en-US';
  context.switchToHttp().getRequest().claim.emails = 'test@gmail.com';
  const mockCallHandler = {
    handle: jest.fn(),
  };

  beforeEach(() => {
    interceptor = new SyncValidateInterceptor(
      new AppLogger(new ConfigService()),
      mockedUserGroupAssignmentRepository as any,
      mockUserRepository as any,
      mockI18nService as any,
      mockGroupRepository as any,
      mockUserCiamLinkRepository as any,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('HttpException: lastStatusUpdatedAt must be a Date instance', async () => {
    try {
      jest.spyOn(mockUserRepository, 'getUserByCiam').mockReturnValue(mockUser);
      const lastStatusUpdatedAt = '2';
      context.switchToHttp().getRequest().body.lastStatusUpdatedAt =
        lastStatusUpdatedAt;
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'lastStatusUpdatedAt must be a Date instance',
      );
    }
  });

  it('HttpException: The update time is greater than the current time.', async () => {
    try {
      jest.spyOn(mockUserRepository, 'getUserByCiam').mockReturnValue(mockUser);
      const lastStatusUpdatedAt = '3024-04-01T07:03:31.000Z';
      context.switchToHttp().getRequest().body.lastStatusUpdatedAt =
        lastStatusUpdatedAt;
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'The update time is greater than the current time.',
      );
    }
  });

  it('HttpException: Group not found or does not belong to this user.', async () => {
    try {
      jest.spyOn(mockUserRepository, 'getUserByCiam').mockReturnValue(mockUser);
      const lastStatusUpdatedAt = '2024-04-01T07:03:31.000Z';
      context.switchToHttp().getRequest().body.lastStatusUpdatedAt =
        lastStatusUpdatedAt;
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'Group not found or does not belong to this user.',
      );
    }
  });

  it('sync data success', async () => {
    jest.spyOn(mockUserRepository, 'getUserByCiam').mockReturnValue(mockUser);
    jest.spyOn(mockGroupRepository, 'getGroupRelationships').mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      machines: [
        {
          currentStatus: MachineCurrentStatus.CREATED,
        },
      ],
    });
    const lastStatusUpdatedAt = '2024-04-01T07:03:31.000Z';
    context.switchToHttp().getRequest().body.lastStatusUpdatedAt =
      lastStatusUpdatedAt;
    await interceptor.intercept(context, mockCallHandler);
  });
});
