import { Group } from '@group/entities';
import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { permissions } from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { middlewaresExclude } from '@shared/utils/commons';
import { User, UserGroupAssignment } from '@user/entities';

import { PermissionInterceptor } from './permission.interceptor';

jest.mock('../utils/commons');
describe('PermissionInterceptor', () => {
  let interceptor: PermissionInterceptor;
  const mockUserRepository = {
    getUserByCiam: jest.fn(),
  };

  const mockGroupRepository = {
    findGroupById: jest.fn(),
  };

  const mockUserGroupAssignmentRepository = {
    checkPermissionInGroup: jest.fn(),
  };

  const mockReflector = {
    get: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };

  const mockUserCiamLinkRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';

  const userCiamLink = {
    userCiamLinkId: 'userCIAM2NCG2HXHP4R35R6J0N',
    userId: 'userYE1S2NCG2HXHP4R35R6J0N',
    oid: 'oid',
    iss: 'iss',
    linkedAt: '2024-02-04T23:59:32.000Z',
    ciamEmail: 'mail',
  };

  const context = {
    getHandler: jest.fn(() => {}),
    getRequest: jest.fn().mockReturnThis(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        params: { groupId },
        claim: {},
        headers: {},
      }),
    }),
  } as unknown as ExecutionContext;
  context.switchToHttp().getRequest().headers['x-lang'] = 'en';
  const mockCallHandler = {
    handle: jest.fn(),
  };

  beforeEach(() => {
    interceptor = new PermissionInterceptor(
      new AppLogger(new ConfigService()),
      mockUserRepository as any,
      mockUserGroupAssignmentRepository as any,
      mockReflector as any,
      mockI18nService as any,
      mockUserCiamLinkRepository as any,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('skip processing interceptor', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(true);
    await interceptor.intercept(context, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });

  it('UnauthorizedException: User not exist', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);
    const mockGroupOutput = new Group();
    mockGroupOutput.groupId = groupId;
    mockGroupRepository.findGroupById.mockReturnValue(mockGroupOutput);
    mockUserRepository.getUserByCiam.mockReturnValue(undefined);
    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain('User not exist.');
    }
  });

  it('UnauthorizedException: User not exist', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);
    const mockGroupOutput = new Group();
    mockGroupOutput.groupId = groupId;
    mockGroupRepository.findGroupById.mockReturnValue(mockGroupOutput);
    mockUserRepository.getUserByCiam.mockReturnValue(undefined);
    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain('User not exist.');
    }
  });

  it('ForbiddenException: User have not permissions in this group', async () => {
    const mockGroupOutput = new Group();
    mockGroupOutput.groupId = groupId;
    const mockUserOutput = new User();
    mockUserOutput.userId = userId;
    const mockUserGroupAssignmentOutput = {
      userId,
      groupId,
      userGroupPermissionAssignments: [
        {
          userId,
          groupId,
        },
      ],
    } as unknown as UserGroupAssignment;
    mockGroupRepository.findGroupById.mockReturnValue(mockGroupOutput);
    mockUserRepository.getUserByCiam.mockReturnValue(mockUserOutput);
    mockUserGroupAssignmentRepository.checkPermissionInGroup.mockReturnValue(
      mockUserGroupAssignmentOutput,
    );
    mockReflector.get.mockReturnValue(permissions.userGroupAssignment.create);
    mockUserCiamLinkRepository.findOne.mockReturnValue(userCiamLink);
    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error.message).toContain(
        'User have not permissions in this group.',
      );
    }
  });

  it('permission interceptor success', async () => {
    const mockGroupOutput = new Group();
    mockGroupOutput.groupId = groupId;
    const mockUserOutput = new User();
    mockUserOutput.userId = userId;
    mockReflector.get.mockReturnValue(permissions.userGroupAssignment.delete);
    const mockUserGroupAssignmentOutput = {
      userId,
      groupId,
      userGroupPermissionAssignments: [
        {
          userId,
          groupId,
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
    } as unknown as UserGroupAssignment;

    mockGroupRepository.findGroupById.mockReturnValue(mockGroupOutput);
    mockUserRepository.getUserByCiam.mockReturnValue(mockUserOutput);
    mockUserGroupAssignmentRepository.checkPermissionInGroup.mockReturnValue(
      mockUserGroupAssignmentOutput,
    );
    mockUserCiamLinkRepository.findOne.mockReturnValue(userCiamLink);
    await interceptor.intercept(context, mockCallHandler);
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
