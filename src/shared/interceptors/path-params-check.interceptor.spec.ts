import { ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ErrorType,
  GroupCurrentStatus,
  MachineCurrentStatus,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { middlewaresExclude } from '@shared/utils/commons';

import { PathParamsCheckInterceptor } from '.';

jest.mock('../utils/commons');
describe('PathParamsCheckInterceptor', () => {
  let interceptor: PathParamsCheckInterceptor;

  const mockGroupRepository = {
    getGroupRelationships: jest.fn(),
  };

  const mockReflector = {
    get: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn(),
  };

  const groupId = 'groupE2D3DE0SAVCGDC8DMP74E';
  const userId = 'userYE1S2NCG2HXHP4R35R6J0N';
  const machineId = 'machineS2NCG2HXHP4R35R6J0N';
  const machineReportId = 'machineReportHXHP4R35R6J0N';
  const customInspectionFormId = 'inspectionFormXHP4R35R6J0N';
  const inspectionId = 'inspectionQWEAXHP4R35R6J0N';

  const context = {
    getHandler: jest.fn(() => {}),
    getRequest: jest.fn().mockReturnThis(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        params: {},
        claim: {},
        headers: { 'x-lang': 'en' },
      }),
    }),
  } as unknown as ExecutionContext;

  const mockCallHandler = {
    handle: jest.fn(),
  };

  beforeEach(() => {
    interceptor = new PathParamsCheckInterceptor(
      new AppLogger(new ConfigService()),
      mockGroupRepository as any,
      mockReflector as any,
      mockI18nService as any,
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

  it('NotFoundException: Group not found', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId };

    mockGroupRepository.getGroupRelationships.mockReturnValue(undefined);
    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'Group not found or does not belong to this user.',
      );
      expect(error.response.errorType).toContain(ErrorType.GROUP_NOT_FOUND);
    }
  });

  it('NotFoundException: Group already deleted', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.DELETED,
    });
    mockI18nService.t.mockReturnValue('Not Found Exception');

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain('The group has been deleted.');
      expect(error.response.customMessage).toContain('Not Found Exception');
      expect(error.response.errorType).toContain(ErrorType.GROUP_NOT_FOUND);
    }
  });

  it('NotFoundException: Machine not found', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId, machineId };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      machines: [],
    });

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'Machine not found or not in this group.',
      );
      expect(error.response.errorType).toContain(ErrorType.MACHINE_NOT_FOUND);
    }
  });

  it('NotFoundException: Machine already deleted', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId, machineId };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      machines: [{ currentStatus: MachineCurrentStatus.DELETED }],
    });
    mockI18nService.t.mockReturnValue('Not Found Exception');

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain('The machine has been deleted.');
      expect(error.response.customMessage).toContain('Not Found Exception');
      expect(error.response.errorType).toContain(ErrorType.MACHINE_NOT_FOUND);
    }
  });

  it('NotFoundException: Inspection not found', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = {
      groupId,
      machineId,
      inspectionId,
    };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      machines: [
        { currentStatus: MachineCurrentStatus.CREATED, inspections: [] },
      ],
    });

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'Inspection not found or not in this machine.',
      );
      expect(error.response.errorType).toContain(
        ErrorType.INSPECTION_NOT_FOUND,
      );
    }
  });

  it('NotFoundException: Machine report not found', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = {
      groupId,
      machineId,
      machineReportId,
    };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      machines: [
        { currentStatus: MachineCurrentStatus.CREATED, machineReports: [] },
      ],
    });

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'Machine report not found or not in this machine.',
      );
      expect(error.response.errorType).toContain(
        ErrorType.MACHINE_REPORT_NOT_FOUND,
      );
    }
  });

  it('NotFoundException: User assignment not found', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId, userId };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      userGroupAssignments: [],
    });

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain('User not found or not in this group.');
      expect(error.response.errorType).toContain(ErrorType.USER_NOT_FOUND);
    }
  });

  it('NotFoundException: User has been unassigned from the group.', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      userGroupAssignments: [
        {
          currentStatus: UserGroupAssignmentCurrentStatus.UNASSIGNED,
        },
      ],
    });
    mockI18nService.t.mockReturnValue('Not Found Exception');

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain(
        'The user has been unassigned from the group.',
      );
      expect(error.response.customMessage).toContain('Not Found Exception');
      expect(error.response.errorType).toContain(ErrorType.USER_NOT_FOUND);
    }
  });

  it('NotFoundException: User already deleted.', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = { groupId };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      userGroupAssignments: [
        {
          currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
          user: undefined,
        },
      ],
    });
    mockI18nService.t.mockReturnValue('Not Found Exception');

    try {
      await interceptor.intercept(context, mockCallHandler);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toContain('The user has been deleted.');
      expect(error.response.customMessage).toContain('Not Found Exception');
      expect(error.response.errorType).toContain(ErrorType.USER_NOT_FOUND);
    }
  });

  it('Check path params success', async () => {
    (middlewaresExclude as jest.Mock).mockReturnValue(false);

    context.switchToHttp().getRequest().params = {
      groupId,
      machineId,
      machineReportId,
      customInspectionFormId,
    };

    mockGroupRepository.getGroupRelationships.mockReturnValue({
      currentStatus: GroupCurrentStatus.CREATED,
      machines: [
        {
          currentStatus: MachineCurrentStatus.CREATED,
          machineReports: [{}],
          customInspectionForms: [{}],
        },
      ],
    });

    await interceptor.intercept(context, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
