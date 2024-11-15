import { GroupQuery } from '@group/dtos';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  DeviceCurrentStatus,
  DevicePlatform,
  ISOLocaleCode,
  UserCurrentStatus,
} from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  GetUserSettingOutput,
  RegisterUserInput,
  UpdateUserDeviceInput,
  UpdateUserDeviceOutput,
  UpdateUserProfileInput,
  UpdateUserSettingInput,
  UserOutput,
  UserPermissionsOutput,
} from '@user/dtos';
import { UserService } from '@user/services/user.service';

import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  const mockedUserService = {
    registerUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    getMyProfile: jest.fn(), // Add the findById method here
    updateUserProfile: jest.fn(),
    getUserPermissions: jest.fn(),
    getUserSetting: jest.fn(),
    updateUserSetting: jest.fn(),
    updateUserDevice: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
  const mockUserId = 'userYE1S2NCG2HXHP4R35R6J0N';
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
  const mockRequestContext: RequestContext = new RequestContext();
  const mockGroupQuery: GroupQuery = new GroupQuery();
  mockRequestContext.user = mockUserClaims;
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
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockedUserService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    const mockRequestContext = new RequestContext();
    const registerUserInput = new RegisterUserInput();
    const mockLanguage = 'ja';

    it('should register a user successfully', async () => {
      // Mock timestamp
      const mockDateConstructor = new Date('2023-10-25T08:55:38Z');
      const spy = jest
        .spyOn(global, 'Date')
        .mockImplementation(() => mockDateConstructor);

      const mockRegisterUser: UserOutput = {
        userId: 'user01HD0E2GAANRQ80VJZVD3SEYX6',
        surname: 'surname',
        givenName: 'given name',
        pictureUrl: 'picture url',
        email: 'user@example.com',
        registeredAt: new Date(), // Will be set to the mocked time
        isoLocaleCode: ISOLocaleCode.JA,
        isSearchableByEmail: true,
        residenceCountryCode: 'JP',
        dateOfBirth: '1990',
        currentStatus: UserCurrentStatus.CREATED,
        lastStatusUpdatedAt: new Date(),
        searchId: '0000001',
        suppressDataUsagePopup: undefined,
      };

      mockedUserService.registerUser.mockReturnValue(mockRegisterUser);

      const response = await controller.registerUser(
        mockLanguage,
        mockRequestContext,
        registerUserInput,
      );

      expect(mockedLogger.log).toHaveBeenCalledWith(
        mockRequestContext,
        'registerUser was called',
      );
      expect(response.data).toEqual(mockRegisterUser);
      expect(response.meta).toEqual({});
      spy.mockRestore();
    });

    it('should register a user with an error', async () => {
      mockedUserService.registerUser.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.registerUser(
          mockLanguage,
          mockRequestContext,
          registerUserInput,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('getMyProfile', () => {
    const mockUserOutput: UserOutput = new UserOutput();
    mockUserOutput.userId = mockUserId;
    it('should return the user profile', async () => {
      mockedUserService.getMyProfile.mockResolvedValue(mockUserOutput);
      const mockRequestContext: RequestContext = new RequestContext();
      mockRequestContext.user = mockUserClaims;

      const result = await controller.getMyProfile(mockRequestContext, req);

      // Assert
      expect(mockedUserService.getMyProfile).toHaveBeenCalledWith(
        mockRequestContext,
        req,
      );

      expect(result).toEqual({ data: mockUserOutput, meta: {} });
    });

    it('userService.findById error', async () => {
      mockedUserService.getMyProfile.mockRejectedValue(new Error());
      try {
        await controller.getMyProfile(mockRequestContext, req);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      expect(mockedUserService.getMyProfile).toHaveBeenCalledWith(
        mockRequestContext,
        req,
      );
    });
  });

  describe('updateMyProfile', () => {
    it('Should return user if update user successfully', async () => {
      // Mock timestamp
      const mockDateConstructor = new Date('2023-10-25T08:55:38Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDateConstructor);
      const mockUpdateUser: UserOutput = {
        userId: 'user01HD0E2GAANRQ80VJZVD3SEYX6',
        surname: 'surname',
        givenName: 'given name',
        pictureUrl: 'picture url',
        email: 'user@example.com',
        registeredAt: new Date(), // Will be set to the mocked time
        isoLocaleCode: ISOLocaleCode.JA,
        isSearchableByEmail: true,
        residenceCountryCode: 'JP',
        dateOfBirth: '1990',
        currentStatus: UserCurrentStatus.UPDATED,
        lastStatusUpdatedAt: new Date(),
        searchId: '0000001',
        suppressDataUsagePopup: undefined,
      };
      const input = new UpdateUserProfileInput();
      mockedUserService.updateUserProfile.mockResolvedValue(mockUpdateUser);

      expect(
        await controller.updateMyProfile(mockRequestContext, input),
      ).toEqual({
        data: mockUpdateUser,
        meta: {},
      });
    });

    it('should throw BadRequestException when updating user profile with bad request error', async () => {
      const input = new UpdateUserProfileInput();

      mockedUserService.updateUserProfile.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateMyProfile(mockRequestContext, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('getUserPermissions', () => {
    const mockUserPermissionsOutput: UserPermissionsOutput =
      new UserPermissionsOutput();
    mockUserPermissionsOutput.userId = mockUserId;
    mockRequestContext.user = mockUserClaims;
    it('should return the user permissions', async () => {
      mockedUserService.getUserPermissions.mockResolvedValue(
        mockUserPermissionsOutput,
      );
      const mockRequestContext: RequestContext = new RequestContext();
      mockRequestContext.user = mockUserClaims;

      const result = await controller.getUserPermissions(
        mockRequestContext,
        mockGroupQuery,
      );

      expect(mockedUserService.getUserPermissions).toHaveBeenCalledWith(
        mockRequestContext,
        mockGroupQuery,
      );

      expect(result).toEqual({ data: mockUserPermissionsOutput, meta: {} });
    });

    it('permissionService.getUserPermissions error', async () => {
      mockedUserService.getUserPermissions.mockRejectedValue(new Error());
      try {
        await controller.getUserPermissions(mockRequestContext, mockGroupQuery);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      expect(mockedUserService.getUserPermissions).toHaveBeenCalledWith(
        mockRequestContext,
        mockGroupQuery,
      );
    });
  });

  describe('getUserSetting', () => {
    const mockUserSettingOutput: GetUserSettingOutput =
      new GetUserSettingOutput();
    it('should return get the user setting success', async () => {
      mockedUserService.getUserSetting.mockResolvedValue(mockUserSettingOutput);
      const mockRequestContext: RequestContext = new RequestContext();
      mockRequestContext.user = mockUserClaims;

      const result = await controller.getUserSetting(mockRequestContext);

      // Assert
      expect(mockedUserService.getUserSetting).toHaveBeenCalledWith(
        mockRequestContext,
      );

      expect(result).toEqual({ data: mockUserSettingOutput, meta: {} });
    });

    it('should get user setting error', async () => {
      mockedUserService.getUserSetting.mockRejectedValue(new Error());
      try {
        await controller.getUserSetting(mockRequestContext);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      expect(mockedUserService.getUserSetting).toHaveBeenCalledWith(
        mockRequestContext,
      );
    });
  });

  describe('updateUserSetting', () => {
    const input: UpdateUserSettingInput = {
      reportNotification: false,
      inspectionNotification: false,
      suppressDataUsagePopup: true,
    };
    it('Should return successfully', async () => {
      mockedUserService.updateUserSetting.mockResolvedValue(input);

      expect(
        await controller.updateUserSetting(mockRequestContext, input),
      ).toEqual({
        data: input,
        meta: {},
      });
    });

    it('should updateUserProfile error', async () => {
      mockedUserService.updateUserSetting.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateUserSetting(mockRequestContext, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('updateUserDevice', () => {
    const input: UpdateUserDeviceInput = {
      deviceType: DevicePlatform.ANDROID,
      fcmToken: 'token',
    };
    const output: UpdateUserDeviceOutput = {
      deviceId: '1                         ',
      userId: 'test',
      deviceType: DevicePlatform.ANDROID,
      fcmToken: 'token',
      lastActiveAt: new Date(),
      currentStatus: DeviceCurrentStatus.DELETED,
      lastStatusUpdatedAt: new Date(),
    };
    it('Should return successfully', async () => {
      mockedUserService.updateUserDevice.mockResolvedValue(output);

      expect(
        await controller.updateUserDevice(mockRequestContext, input),
      ).toEqual({ data: output, meta: {} });
    });

    it('should updateUserProfile error', async () => {
      mockedUserService.updateUserDevice.mockRejectedValue(
        new BadRequestException('Bad request error'),
      );

      try {
        await controller.updateUserDevice(mockRequestContext, input);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Bad request error');
      }
    });
  });

  describe('deleteUser', () => {
    it('Should return successfully', async () => {
      mockedUserService.deleteUser.mockResolvedValue({
        data: {},
        meta: {},
      });

      expect(await controller.deleteUser(mockRequestContext)).toEqual({
        data: {},
        meta: {},
      });
    });

    it('should deleteUser error', async () => {
      mockedUserService.deleteUser.mockRejectedValue(
        new HttpException('delete user b2c error', 404),
      );

      try {
        await controller.deleteUser(mockRequestContext);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('delete user b2c error');
      }
    });
  });
});
