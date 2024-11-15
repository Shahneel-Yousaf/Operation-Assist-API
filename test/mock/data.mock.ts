import {
  CustomInspectionFormCurrentStatus,
  dateFormat,
  DevicePlatform,
  GroupCurrentStatus,
  GroupMachineCondition,
  InspectionCurrentStatus,
  ISOLocaleCode,
  MachineCurrentStatus,
  MachineReportCurrentStatus,
  MachineReportResponseStatus,
  UserCurrentStatus,
  UserGroupAssignmentCurrentStatus,
} from '@shared/constants';
import {
  RegisterUserInput,
  UpdateUserDeviceInput,
  UpdateUserProfileInput,
  UpdateUserSettingInput,
} from '@user/dtos';
import * as dayjs from 'dayjs';
import { ulid } from 'ulid';

const timeNow = new Date();

export const user = {
  userId: ulid(),
  searchId: '000000001',
  givenName: 'givenName',
  surname: 'surname',
  pictureUrl: 'https://picsum.photos/id/1/200/200',
  email: 'default-admin@example.com',
  isSearchableByEmail: true,
  registeredAt: timeNow,
  isoLocaleCode: ISOLocaleCode.EN,
  dateOfBirth: dayjs(timeNow).format(dateFormat.yearOnlyFormat),
  currentStatus: UserCurrentStatus.CREATED,
  lastStatusUpdatedAt: timeNow,
  residenceCountryCode: 'O',
};
export const userCiam = {
  userCiamLinkId: ulid(),
  userId: user.userId,
  oid: 'example_oid',
  iss: 'https://exampleiss.com/oid',
  linkedAt: timeNow,
  ciamEmail: 'email',
};

export const group = {
  groupId: ulid(),
  groupName: 'name',
  location: 'ja',
  currentStatus: GroupCurrentStatus.CREATED,
  lastStatusUpdatedAt: timeNow,
  companyName: 'company name',
};

export const groupSecond = {
  groupId: ulid(),
  groupName: 'group second name',
  location: 'ja',
  currentStatus: GroupCurrentStatus.CREATED,
  lastStatusUpdatedAt: timeNow,
  companyName: 'company name second',
};

export const userGroupAssignment = {
  groupId: group.groupId,
  userId: user.userId,
  currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
  userGroupRoleName: 'role',
  lastStatusUpdatedAt: timeNow,
  userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
};

export const userGroupPermissionAssignment = [
  {
    permissionId: '065BDR71D53H2ZBB5RA7334MC4',
    userId: user.userId,
    groupId: group.groupId,
    assignedAt: timeNow,
  },
  {
    permissionId: '065BDR7Q6HW2QNZZ3E9S6M9SD8',
    userId: user.userId,
    groupId: group.groupId,
    assignedAt: timeNow,
  },
];

export const userGroupSetting = {
  groupId: group.groupId,
  userId: user.userId,
};

export const registerUserInput: RegisterUserInput = {
  surname: 'surname',
  pictureUrl: 'https://picsum.photos/id/1/200/200',
  email: 'default-admin@example.com',
  isoLocaleCode: ISOLocaleCode.JA,
  givenName: 'given name',
  isSearchableByEmail: false,
  residenceCountryCode: 'O',
  dateOfBirth: '1990',
};

export const mockGroupId = 'GROUPE2D3DE0SAVCGDC8DMP74E';
export const mockMachineId = 'MACHINE2D3DE0SAVCGDC8DMP74';
export const mockMachineReportId = 'MACHINEREPORT2D3DE0SAVCGDC';
export const mockCustomInspectionFormId = 'INSPECTIONFORM2D3DEKQAWCGD';
export const mockInspectionId = 'INSPECTIOND2D3FAVGS3F3FBXV';
export const mockInspectionFormTemplateId = 'INSPECTIONFORMTEMPLATE1NR5';
export const machineReportResponseId = '01J1C0YZQQYBAGZB2F7AY68YR0';

export const mockLoginUser = {
  userId: 'USERC8KR9DYH6WB1N6G6AFVBFD',
  searchId: '000000001',
  givenName: 'givenName',
  surname: 'surname',
  pictureUrl: 'pictureUrl',
  email: 'default-admin@example.com',
  isSearchableByEmail: true,
  registeredAt: new Date(),
  isoLocaleCode: ISOLocaleCode.JA,
  residenceCountryCode: 'O',
  dateOfBirth: '2023',
  currentStatus: UserCurrentStatus.CREATED,
  lastStatusUpdatedAt: new Date(),
};

export const mockLoginUserCaimLink = {
  userCiamLinkId: 'USERCIAMLINKH6WB1N6G6AFVBC',
  userId: 'USERC8KR9DYH6WB1N6G6AFVBFD',
  oid: 'example_oid',
  iss: 'https://exampleiss.com/oid',
  linkedAt: new Date(),
  ciamEmail: 'ciam email',
};

export const mockGroup = {
  groupId: mockGroupId,
  groupName: 'groupName',
  location: 'location',
  currentStatus: GroupCurrentStatus.CREATED,
  lastStatusUpdatedAt: new Date(),
  companyName: 'company name',
};

export const mockUserGroupAssignment = {
  groupId: mockGroupId,
  userId: mockLoginUser.userId,
  lastStatusUpdatedAt: new Date(),
  currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
  userGroupRoleName: 'groupName',
  location: 'location',
  userGroupRoleTemplateId: '065BDMT6RRTEF1A989H6AVJT5W',
};

export const mockUserGroupPermissionAssignment = [
  {
    groupId: mockGroupId,
    userId: mockLoginUser.userId,
    permissionId: '065BDR92ZNGHX3R18CANF69Z00',
    assignedAt: new Date(),
  },
];

export const mockGroupDeleted = {
  groupId: ulid(),
  groupName: 'group exist deleted',
  location: 'ja',
  currentStatus: GroupCurrentStatus.DELETED,
  lastStatusUpdatedAt: timeNow,
  companyName: 'company name',
};

export const updateUserProfileInput: UpdateUserProfileInput = {
  surname: 'surname edit',
  givenName: 'given name edit',
  pictureUrl: 'https://picsum.photos/id/1/200/200',
  isSearchableByEmail: false,
  isoLocaleCode: ISOLocaleCode.EN,
  residenceCountryCode: 'O',
  dateOfBirth: '1990',
  email: 'test@example.com',
};

export const updateUserDeviceInput: UpdateUserDeviceInput = {
  deviceType: DevicePlatform.IOS,
  fcmToken: 'fcmToken',
};

export const machine = {
  machineId: ulid(),
  machineName: 'machine name',
  pictureUrl: 'string',
  modelAndType: 'DFSEFRE',
  serialNumber: 'serial number',
  serialNumberPlatePictureUrl: '',
  currentStatus: MachineCurrentStatus.CREATED,
  lastStatusUpdatedAt: '2024-01-16T02:00:30.000Z',
  machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
  machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
  groupId: group.groupId,
};

export const machineReport = {
  machineReportId: ulid(),
  reportTitle: 'title',
  lastStatusUpdatedAt: timeNow,
  firstMachineReportResponseId: machineReportResponseId,
  lastMachineReportResponseId: ulid(),
  currentStatus: MachineReportCurrentStatus.UPDATED,
  machineId: machine.machineId,
};

export const customInspectionForm = {
  customInspectionFormId: ulid(),
  name: 'inspection name',
  machineId: machine.machineId,
  currentStatus: CustomInspectionFormCurrentStatus.PUBLISHED,
  lastStatusUpdatedAt: new Date(),
};

export const inspection = {
  inspectionId: ulid(),
  inspectionAt: new Date(),
  machineId: machine.machineId,
  lat: 10,
  lng: 10,
  locationAccuracy: 'string',
  devicePlatform: DevicePlatform.IOS,
  currentStatus: InspectionCurrentStatus.POSTED,
  lastStatusUpdatedAt: new Date(),
  customInspectionFormId: customInspectionForm.customInspectionFormId,
};

export const updateUserSettingInput: UpdateUserSettingInput = {
  reportNotification: true,
  inspectionNotification: true,
  suppressDataUsagePopup: true,
};

export const userSetting = {
  userId: user.userId,
  reportNotification: true,
  inspectionNotification: true,
  suppressDataUsagePopup: false,
};

export const userSecond = {
  userId: ulid(),
  searchId: '000000002',
  givenName: 'givenName',
  surname: 'surname',
  pictureUrl: 'https://picsum.photos/id/1/200/200',
  email: 'default-admin1@example.com',
  isSearchableByEmail: true,
  registeredAt: timeNow,
  isoLocaleCode: ISOLocaleCode.EN,
  dateOfBirth: dayjs(timeNow).format(dateFormat.yearOnlyFormat),
  currentStatus: UserCurrentStatus.CREATED,
  lastStatusUpdatedAt: timeNow,
  residenceCountryCode: 'O',
};

export const userSecondCiam = {
  userCiamLinkId: ulid(),
  userId: userSecond.userId,
  oid: 'example_oid2',
  iss: 'https://exampleiss.com/oid2',
  linkedAt: timeNow,
  ciamEmail: 'email second',
};

export const userSecondGroupAssignment = {
  groupId: group.groupId,
  userId: userSecond.userId,
  currentStatus: UserGroupAssignmentCurrentStatus.ASSIGNED,
  userGroupRoleName: 'role',
  lastStatusUpdatedAt: timeNow,
  userGroupRoleTemplateId: '065D0EV3Q686CMBSQCDKR1FACC',
};

export const userGroupPermissionAssignmentUser = {
  permissionId: '065BDR92ZNGHX3R18CANF69Z00',
  userId: user.userId,
  groupId: group.groupId,
  assignedAt: timeNow,
};

export const mockMachine = [
  {
    machineId: ulid(),
    machineName: 'mock machine name',
    machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
    pictureUrl: 'https://picsum.photos/id/1/200/200',
    machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
    modelAndType: 'model and type',
    serialNumber: 'serial number',
    serialNumberPlatePictureUrl: 'https://picserial.photos/id/1/200/200',
    customTypeName: 'customTypeName1',
    customMachineManufacturerName: 'customMachineManufacturerName1',
    groupId: group.groupId,
    currentStatus: MachineCurrentStatus.CREATED,
    lastStatusUpdatedAt: timeNow,
  },
  {
    machineId: ulid(),
    machineName: 'mock machine name 2',
    machineTypeId: '0661J7JX5D7J7BH8MS4M14KEEW',
    pictureUrl: 'https://picsum.photos/id/1/200/200',
    machineManufacturerId: '0661ATBN7XH5EB1NXCFDF4ZTMG',
    modelAndType: 'model and type',
    serialNumber: 'serial number',
    serialNumberPlatePictureUrl: 'https://picserial.photos/id/1/200/200',
    customTypeName: 'customTypeName2',
    customMachineManufacturerName: 'customMachineManufacturerName2',
    groupId: group.groupId,
    currentStatus: MachineCurrentStatus.CREATED,
    lastStatusUpdatedAt: timeNow,
  },
];

export const mockUserGroupMachineFavorite = {
  userId: user,
  groupId: group.groupId,
  machineId: mockMachine[0],
};

export const mockGroupMachineCondition = [
  {
    machineId: mockMachine[0],
    userId: user,
    machineCondition: GroupMachineCondition.NORMAL,
  },
  {
    machineId: mockMachine[1],
    userId: user,
    machineCondition: GroupMachineCondition.NORMAL,
  },
];

export const userGroupPermissionAssignmentMachine = {
  permissionId: '065BDR8DCB6M7H3E25336KH3ZC',
  userId: user.userId,
  groupId: group.groupId,
  assignedAt: timeNow,
};

export const machineReportResponse = {
  machineReportResponseId: machineReportResponseId,
  reportComment: 'comment',
  reportTitle: 'title',
  commentedAt: timeNow,
  userId: user.userId,
  status: MachineReportResponseStatus.RESOLVED,
  machineId: machine.machineId,
  machineReportId: machineReport.machineReportId,
  subtype: 'STATUS_UPDATES',
};

export const machineOperationReport = {
  machineReportResponseId: machineReportResponseId,
  startAt: timeNow,
  endAt: timeNow,
  operationDetail: 'operationDetails',
  comment: 'comment',
};
