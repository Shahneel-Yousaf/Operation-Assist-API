import { ISOLocaleCode } from '@shared/constants';
import { Device, User } from '@user/entities';

import { checkPermissionGroup, groupDeviceUsersByLocaleCode } from './commons';

describe('Commons', () => {
  describe('checkPermissionGroup', () => {
    const mockPermission = undefined;
    const mockUserId = 'userIdQT8M4PF2Y8PTXN9Z4PFP';
    const mockGroupId = 'groupIdWA3YC18EDV4WZM23759';
    const mockUserGroupAssignmentRepo = {
      checkPermissionInGroup: jest.fn(),
    } as any;

    it('checkPermissionGroup success', async () => {
      const mockOutput = {
        allowEditDeleteGroup: false,
        allowCreateEditDeleteMachine: false,
        allowCreateEditDeleteMember: false,
        allowCreateEditDeleteInspectionForm: false,
        allowCreateInspectionAndReport: true,
      };

      const mockUserPermission = {
        userId: mockUserId,
        groupId: mockGroupId,
        lastStatusUpdatedAt: '2023-12-19T07:25:35.000Z',
        currentStatus: 'ASSIGNED',
        userGroupRoleName: 'role name',
        userGroupPermissionAssignments: [
          {
            userId: mockUserId,
            groupId: mockGroupId,
            permissionId: 'permissionId53H2ZBB5RA7334',
            assignedAt: '2024-01-01T19:59:17.450Z',
            permission: {
              permissionId: 'permissionId53H2ZBB5RA7334',
              resourceId: 'permissionId4M29P07VHX8EWB',
              operationId: 'operationIdKJHBD0WT6T33NQZ',
              operation: {
                operationId: 'operationIdKJHBD0WT6T33NQZ',
                operationCode: 'READ_CREATE',
              },
              resource: {
                resourceId: 'permissionId4M29P07VHX8EWB',
                resourceCode: 'INSPECTIONS_AND_MACHINE_REPORTS',
              },
            },
          },
        ],
      };

      mockUserGroupAssignmentRepo.checkPermissionInGroup.mockReturnValue(
        mockUserPermission,
      );

      expect(
        await checkPermissionGroup(
          mockPermission,
          mockUserId,
          mockGroupId,
          mockUserGroupAssignmentRepo,
        ),
      ).toEqual(mockOutput);
    });
  });

  describe('groupDeviceUsersByLocaleCode', () => {
    it('groupDeviceUsersByLocaleCode success', async () => {
      const userDevices = [new User()];
      userDevices[0].devices = [new Device()];
      userDevices[0].isoLocaleCode = ISOLocaleCode.EN;
      userDevices[0].devices[0].fcmToken = 'token';
      userDevices[0].devices[0].userId = 'id';

      const groupDevices = {
        en: [{ fcmToken: 'token' }],
      };

      expect(groupDeviceUsersByLocaleCode(userDevices)).toEqual(groupDevices);
    });
  });
});
