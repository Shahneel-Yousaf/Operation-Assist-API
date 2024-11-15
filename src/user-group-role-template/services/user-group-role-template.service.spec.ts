import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { UserGroupRoleTemplateController } from '@user-group-role-template/controllers/user-group-role-template.controller';
import { UserGroupRoleTemplateOutput } from '@user-group-role-template/dtos';
import { UserGroupRoleTemplateRepository } from '@user-group-role-template/repositories/user-group-role-template.repository';
import { UserGroupRoleTemplateService } from '@user-group-role-template/services/user-group-role-template.service';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

describe('UserGroupRoleTemplate', () => {
  let service: UserGroupRoleTemplateService;
  let repository: UserGroupRoleTemplateRepository;

  const userGroupRoleTemplateOutput: UserGroupRoleTemplateOutput[] = [
    {
      userGroupRoleTemplateId: 'userGroupRoleTemplateId123',
      roleCode: 'role code 1',
      isAdmin: true,
      userGroupRoleNameTranslation: {
        userGroupRoleTemplateId: 'userGroupRoleTemplateId123',
        isoLocaleCode: ISOLocaleCode.JA,
        roleName: 'role name',
      },
      permissionTranslates: [
        {
          permissionId: 'permissionId12345678910111',
          isoLocaleCode: ISOLocaleCode.JA,
          permissionName: 'permission name',
          isChecked: true,
        },
      ],
    },
  ];

  const userGroupRoleTemplate = [
    {
      userGroupRoleTemplateId: 'userGroupRoleTemplateId123',
      roleCode: 'role code 1',
      isAdmin: true,
      userGroupRoleNameTranslations: [
        {
          userGroupRoleTemplateId: 'userGroupRoleTemplateId123',
          isoLocaleCode: ISOLocaleCode.JA,
          roleName: 'role name',
        },
      ],
      userGroupRoleTemplatePermissionAssignments: [
        {
          permissionId: 'permissionId12345678910111',
          userGroupRoleTemplateId: 'userGroupRoleTemplateId123',
          assignedAt: '2023-09-30T17:00:00.000Z',
          permission: {
            permissionId: 'permissionId12345678',
            resourceId: 'resourceId1234567891011121',
            operationId: 'operationId123456789101112',
            permissionTranslations: [
              {
                permissionId: 'permissionId12345678910111',
                isoLocaleCode: ISOLocaleCode.JA,
                permissionName: 'permission name',
              },
            ],
          },
        },
      ],
    },
  ];

  const mockedUserGroupRoleTemplateRepository = {
    getTemplateRoles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupRoleTemplateController],
      providers: [
        AppLogger,
        ConfigService,
        UserGroupRoleTemplateService,
        {
          provide: UserGroupRoleTemplateRepository,
          useValue: { mockedUserGroupRoleTemplateRepository },
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserGroupRoleTemplateService>(
      UserGroupRoleTemplateService,
    );

    repository = module.get<UserGroupRoleTemplateRepository>(
      UserGroupRoleTemplateRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTemplateRoles', () => {
    it('getTemplateRoles success', async () => {
      repository.getTemplateRoles = jest
        .fn()
        .mockReturnValue(userGroupRoleTemplate);

      const result = await service.getTemplateRoles(ISOLocaleCode.JA);

      expect(
        plainToInstance(UserGroupRoleTemplateOutput, result, {
          excludeExtraneousValues: true,
        }),
      ).toEqual(userGroupRoleTemplateOutput);
    });

    it('should report an error when the getTemplateRoles repository fails', async () => {
      repository.getTemplateRoles = jest
        .fn()
        .mockRejectedValue({ message: 'Error test' });

      try {
        await service.getTemplateRoles(ISOLocaleCode.JA);
      } catch (error) {
        expect(error.message).toEqual('Error test');
      }
    });
  });
});
