import { BlobStorageService } from '@blob-storage/services/blob-storage.service';
import { createMock } from '@golevelup/ts-jest';
import { GraphAPIService } from '@graph-api/services/graph-api.service';
import { GroupQuery } from '@group/dtos';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DevicePlatform,
  ISOLocaleCode,
  UserCurrentStatus,
} from '@shared/constants';
import { CiamLinkType, UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { generateRandomSearchId } from '@shared/utils/commons';
import {
  GetUserSettingOutput,
  RegisterUserInput,
  UpdateUserDeviceInput,
  UpdateUserProfileInput,
  UpdateUserSettingInput,
  UserPermissionsOutput,
} from '@user/dtos';
import {
  Device,
  UserCiamLink,
  UserGroupAssignment,
  UserGroupAssignmentHistory,
  UserHistory,
  UserSetting,
} from '@user/entities';
import { User } from '@user/entities/user.entity';
import {
  DeviceRepository,
  UserGroupAssignmentRepository,
  UserRepository,
  UserSettingRepository,
} from '@user/repositories';
import { I18nService } from 'nestjs-i18n';
import { DataSource, UpdateResult } from 'typeorm';

import { UserService } from './user.service';

const mockUnix = jest.fn();
jest.mock('dayjs', () => () => ({
  toDate: jest.fn().mockReturnThis(),
  add: jest.fn().mockReturnThis(),
  unix: mockUnix,
  default: jest.fn().mockReturnThis(),
}));
jest.mock('../../shared/utils/commons.ts');

describe('UserService', () => {
  let service: UserService;
  let dataSource: DataSource;

  const mockedRepository = {
    getUserByCiam: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
    getById: jest.fn(),
    getUserProfile: jest.fn(),
  };

  const mockedUserGroupAssignmentRepository = {
    getUserPermissions: jest.fn(),
  };

  const mockedUserSettingRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockedDeviceRepository = {
    update: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockedLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };
  const mockI18n = { t: jest.fn() };
  const mockBlobStorageService = { generateSasUrl: jest.fn() };
  const mockGraphAPIService = {
    deleteB2CUser: jest.fn(),
  };
  const mockUserId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const mockGroupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const mockUserClaims: UserAccessTokenClaims = {
    userId: mockUserId,
    email: 'user@example.com',
    isoLocaleCode: ISOLocaleCode.EN,
    surname: 'user',
    givenName: 'bui',
    searchId: '1',
    pictureUrl: 'url',
    isSearchableByEmail: true,
    registeredAt: new Date(),
    residenceCountryCode: 'jp',
    dateOfBirth: '2024',
    currentStatus: UserCurrentStatus.CREATED,
    lastStatusUpdatedAt: new Date(),
  };
  const mockCiamLinkType: CiamLinkType = {
    oid: 'example_oid',
    iss: 'https://exampleiss.com/oid',
    preferredUsername: 'user@example.com',
    emails: ['email'],
  };
  const mockRequestContext: RequestContext = new RequestContext();
  mockRequestContext.user = mockUserClaims;
  mockRequestContext.userCiamLink = mockCiamLinkType;
  const mockGroupQuery: GroupQuery = new GroupQuery();
  mockGroupQuery.groupId = mockGroupId;
  const req = {
    claim: {
      oid: '272396d8-8b2a-4ccb-bf1b-64c1221d2f8b',
      iss: 'iss',
      preferredUsername: undefined,
      emails: ['email'],
    },
    headers: {
      'x-lang': ISOLocaleCode.EN,
    },
  };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockedRepository,
        },
        {
          provide: UserGroupAssignmentRepository,
          useValue: mockedUserGroupAssignmentRepository,
        },
        {
          provide: AppLogger,
          useValue: mockedLogger,
        },
        {
          provide: DataSource,
          useValue: createMock<DataSource>(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        { provide: AppLogger, useValue: mockedLogger },
        { provide: BlobStorageService, useValue: mockBlobStorageService },
        {
          provide: I18nService,
          useValue: mockI18n,
        },
        {
          provide: UserSettingRepository,
          useValue: mockedUserSettingRepository,
        },
        {
          provide: DeviceRepository,
          useValue: mockedDeviceRepository,
        },
        {
          provide: GraphAPIService,
          useValue: mockGraphAPIService,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    const mockRequestContext = new RequestContext();
    const mockLanguage = 'ja';
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.userCiamLink = new CiamLinkType();
    const registerUserInput: RegisterUserInput = {
      email: 'user@example.com',
      givenName: 'given name',
      surname: 'surname',
      pictureUrl: 'string',
      isoLocaleCode: ISOLocaleCode.JA,
      isSearchableByEmail: true,
      residenceCountryCode: 'JA',
      dateOfBirth: '1990',
    };

    it('should throw BadRequestException if user is already in use.', async () => {
      const mockUser = createMock<User>();
      mockedRepository.getUserByCiam.mockResolvedValue(mockUser);

      try {
        await service.registerUser(
          mockRequestContext,
          registerUserInput,
          mockLanguage,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('This user is already in use.');
      }
    });

    it('should return a new user if user register successfully', async () => {
      mockedRepository.getUserByCiam.mockResolvedValue(null);
      mockRequestContext.userCiamLink.preferredUsername = 'user@example.com';
      mockRequestContext.userCiamLink.emails = ['mail'];

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const userRepo: User = mockDataSource.getRepository(User);
      const userCiamLinkRepo = mockDataSource.getRepository(UserCiamLink);
      const userSettingRepo = mockDataSource.getRepository(UserSetting);
      const userHistoryRepo = mockDataSource.getRepository(UserHistory);

      await service.registerUser(
        mockRequestContext,
        registerUserInput,
        mockLanguage,
      );

      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'registerUser was called',
      );
      expect(spyTransaction).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(userCiamLinkRepo.insert).toHaveBeenCalled();
      expect(userSettingRepo.insert).toHaveBeenCalled();
      expect(userHistoryRepo.insert).toHaveBeenCalled();
    });

    it('should throw BadRequestException if generate a unique search_id over 100 attempts', async () => {
      mockedRepository.getUserByCiam.mockResolvedValue(null);
      mockedRepository.findOne.mockImplementationOnce(() => undefined);
      mockRequestContext.userCiamLink.preferredUsername = 'user@example.com';
      mockedRepository.findOne.mockImplementation(() => ({
        searchId: '123456789',
      }));
      (generateRandomSearchId as jest.Mock).mockImplementation(
        () => '123456789',
      );

      try {
        await service.registerUser(
          mockRequestContext,
          registerUserInput,
          mockLanguage,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Failed to generate a unique search_id over 100 attempts',
        );
      }
    });
  });

  describe('getMyProfile', () => {
    it('should throw NotFoundException when user is not found', async () => {
      jest
        .spyOn(mockedRepository, 'getUserProfile')
        .mockResolvedValueOnce(undefined);

      await expect(
        service.getMyProfile(mockRequestContext, req),
      ).rejects.toThrow(HttpException);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'getMyProfile was called',
      );
      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'calling UserRepository.getUserProfile',
      );
    });

    it('should return UserOutput when user is found', async () => {
      const userOutputMock = {
        userId: mockUserId,
        email: 'user@example.com',
        isoLocaleCode: ISOLocaleCode.EN,
        surname: 'user',
        givenName: 'bui',
        searchId: '1',
        pictureUrl: undefined,
        isSearchableByEmail: true,
        registeredAt: new Date(),
        residenceCountryCode: 'jp',
        dateOfBirth: '2024',
        currentStatus: UserCurrentStatus.CREATED,
        lastStatusUpdatedAt: new Date(),
        suppressDataUsagePopup: false,
        userSetting: {
          suppressDataUsagePopup: false,
        },
      };
      mockedRepository.getUserProfile.mockReturnValue(userOutputMock);
      const result = await service.getMyProfile(mockRequestContext, req);

      expect(result).toEqual(userOutputMock);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'getMyProfile was called',
      );
      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'calling UserRepository.getUserProfile',
      );
    });
  });

  describe('updateUserProfile', () => {
    const ctx = new RequestContext();
    ctx.user = new UserAccessTokenClaims();
    ctx.user.userId = mockUserId;

    const updateUserProfileInput: UpdateUserProfileInput = {
      pictureUrl: 'mypicture',
      isoLocaleCode: ISOLocaleCode.EN,
      surname: 'test surname',
      givenName: 'test given name',
      isSearchableByEmail: false,
      residenceCountryCode: 'JP',
      dateOfBirth: '1990',
      email: 'user@example.com',
    };

    it('should call repository.save with correct input', async () => {
      mockedRepository.findOne.mockResolvedValue(undefined);

      const mockDataSource = {
        save: jest.fn(),
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
      };
      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const userRepo: User = mockDataSource.getRepository(User);
      const userHistoryRepo: UserHistory =
        mockDataSource.getRepository(UserHistory);
      mockBlobStorageService.generateSasUrl.mockReturnValue(
        '/mypicture?sas=1234567890',
      );

      const user = await service.updateUserProfile(
        mockRequestContext,
        updateUserProfileInput,
      );

      expect(spyTransaction).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(userHistoryRepo.save).toHaveBeenCalled();
      expect(user.pictureUrl).toEqual('/mypicture?sas=1234567890');
      expect(user.givenName).toEqual(updateUserProfileInput.givenName);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockedRepository.findOne.mockResolvedValue(null);

      try {
        await service.updateUserProfile(ctx, updateUserProfileInput);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });
    it('should throw NotFoundException if email address is already in use.', async () => {
      const foundUser = createMock<User>();
      mockedRepository.findOne.mockResolvedValue(foundUser);

      try {
        await service.updateUserProfile(ctx, updateUserProfileInput);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('This email address is already in use.');
      }
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permission', async () => {
      const mockUserGroupAssignment = [
        {
          userId: mockUserId,
          groupId: mockGroupId,
          userGroupPermissionAssignments: [
            {
              userId: mockUserId,
              groupId: mockGroupId,
              permission: {
                operation: {
                  operationCode: 'CREATE',
                },
                resource: {
                  resourceCode: 'USER_GROUP_ASSIGNMENTS',
                },
              },
            },
          ],
        },
      ];
      jest
        .spyOn(mockedUserGroupAssignmentRepository, 'getUserPermissions')
        .mockResolvedValueOnce(mockUserGroupAssignment);

      mockUnix.mockReturnValue(1635206400);

      const mockUserPermissionsOutput: UserPermissionsOutput =
        new UserPermissionsOutput();
      mockUserPermissionsOutput.userId = mockUserId;
      mockUserPermissionsOutput.exp = 1635206400;
      mockUserPermissionsOutput.groups = [
        {
          groupId: 'groupE2D3DE0SAVCGDC8DMP74E',
          permissions: {
            USER_GROUP_ASSIGNMENTS: 'CREATE',
          },
        },
      ];

      const result = await service.getUserPermissions(
        mockRequestContext,
        mockGroupQuery,
      );
      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'getUserPermissions was called',
      );
      expect(result).toEqual(mockUserPermissionsOutput);
    });

    it('ForbiddenException: You do not have permission to access this group', async () => {
      jest
        .spyOn(mockedUserGroupAssignmentRepository, 'getUserPermissions')
        .mockResolvedValueOnce([]);

      try {
        await service.getUserPermissions(mockRequestContext, mockGroupQuery);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toContain(
          'You do not have permission to access this group.',
        );
      }
    });

    it('userGroupAssignmentRepository.getUserPermissions error', async () => {
      jest
        .spyOn(mockedUserGroupAssignmentRepository, 'getUserPermissions')
        .mockRejectedValue(new Error('Get user permission fail.'));
      try {
        await service.getUserPermissions(mockRequestContext, mockGroupQuery);
      } catch (error) {
        expect(mockedLogger.log).toHaveBeenCalledWith(
          mockRequestContext,
          'getUserPermissions was called',
        );
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('Get user permission fail.');
      }
    });
  });

  describe('getUserSetting', () => {
    const mockRequestContext = new RequestContext();
    mockRequestContext.user = new UserAccessTokenClaims();
    mockRequestContext.userCiamLink = new CiamLinkType();
    it('should return getUserSetting success', async () => {
      const userSettingOutputMock: GetUserSettingOutput =
        new GetUserSettingOutput();
      mockedUserSettingRepository.findOne.mockResolvedValue(
        userSettingOutputMock,
      );
      const result = await service.getUserSetting(mockRequestContext);

      expect(result).toEqual(userSettingOutputMock);
      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'getUserSetting was called',
      );
    });
    it('should return getUserSetting error', async () => {
      mockedUserSettingRepository.findOne.mockResolvedValue(new Error());
      try {
        await service.getUserSetting(mockRequestContext);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('updateUserSetting', () => {
    const ctx = new RequestContext();
    ctx.user = new UserAccessTokenClaims();
    ctx.user.userId = mockUserId;

    const input: UpdateUserSettingInput = {
      reportNotification: false,
      inspectionNotification: false,
      suppressDataUsagePopup: true,
    };
    it('should updateUserSetting success', async () => {
      const resultUpdate = new UpdateResult();
      mockedUserSettingRepository.update.mockReturnValue(resultUpdate);

      expect(await service.updateUserSetting(ctx, input)).toEqual(input);
    });

    it('should updateUserSetting error', async () => {
      mockedUserSettingRepository.update.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );
      try {
        await service.updateUserSetting(mockRequestContext, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('updateUserDevice', () => {
    const ctx = new RequestContext();
    ctx.user = new UserAccessTokenClaims();
    ctx.user.userId = mockUserId;

    const input: UpdateUserDeviceInput = {
      deviceType: DevicePlatform.ANDROID,
      fcmToken: 'token',
    };

    it('should updateUserDevice success', async () => {
      const mockDataSource = {
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
        update: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
      };

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const deviceRepo = mockDataSource.getRepository(Device);

      await service.updateUserDevice(ctx, input);
      expect(spyTransaction).toHaveBeenCalled();
      expect(deviceRepo.update).toHaveBeenCalled();
      expect(deviceRepo.findOne).toHaveBeenCalled();
      expect(deviceRepo.create).toHaveBeenCalled();
      expect(deviceRepo.save).toHaveBeenCalled();
    });

    it('should updateUserDevice error', async () => {
      mockedDeviceRepository.update.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );
      try {
        await service.updateUserDevice(mockRequestContext, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('deleteUser', () => {
    const ctx = new RequestContext();
    ctx.user = new UserAccessTokenClaims();
    ctx.user.userId = mockUserId;
    ctx.userCiamLink = mockCiamLinkType;
    ctx.userCiamLink.oid = mockCiamLinkType.oid;

    it('should deleteUser success', async () => {
      const mockDataSource = {
        getRepository: jest.fn(
          (fn) =>
            mockDataSource[fn] ||
            (mockDataSource[fn] = createMock<typeof fn>()),
        ),
        update: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
      };
      mockUnix.mockReturnValue(123456);

      const spyTransaction = (
        dataSource.transaction as jest.Mock
      ).mockImplementation((cb) => cb(mockDataSource));
      const mockUserRepo = mockDataSource.getRepository(User);
      const mockUserHistoryRepo = mockDataSource.getRepository(UserHistory);
      const mockUserGroupAssignmentRepo =
        mockDataSource.getRepository(UserGroupAssignment);
      const mockUserGroupAssignmentHistoryRepo = mockDataSource.getRepository(
        UserGroupAssignmentHistory,
      );

      await service.deleteUser(ctx);
      expect(spyTransaction).toHaveBeenCalled();
      expect(mockUserRepo.update).toHaveBeenCalled();
      expect(mockUserHistoryRepo.create).toHaveBeenCalled();
      expect(mockUserHistoryRepo.insert).toHaveBeenCalled();
      expect(mockUserGroupAssignmentRepo.find).toHaveBeenCalled();
      expect(mockUserGroupAssignmentRepo.update).toHaveBeenCalled();
      expect(mockUserGroupAssignmentHistoryRepo.insert).toHaveBeenCalled();
      expect(mockGraphAPIService.deleteB2CUser).toHaveBeenCalled();
    });

    it('should deleteUser error', async () => {
      mockGraphAPIService.deleteB2CUser.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );
      try {
        await service.deleteUser(mockRequestContext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });
});
