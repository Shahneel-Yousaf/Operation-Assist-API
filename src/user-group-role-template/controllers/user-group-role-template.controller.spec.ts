import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISOLocaleCode } from '@shared/constants';
import { UserAccessTokenClaims } from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { UserGroupRoleTemplateOutput } from '@user-group-role-template/dtos';
import { UserGroupRoleTemplateRepository } from '@user-group-role-template/repositories/user-group-role-template.repository';
import { UserGroupRoleTemplateService } from '@user-group-role-template/services/user-group-role-template.service';
import { DataSource } from 'typeorm';

import { UserGroupRoleTemplateController } from './user-group-role-template.controller';

describe('UserGroupRoleTemplate', () => {
  let controller: UserGroupRoleTemplateController;
  let service: UserGroupRoleTemplateService;

  const ctx = new RequestContext();
  ctx.user = new UserAccessTokenClaims();
  ctx.user.isoLocaleCode = ISOLocaleCode.JA;

  const userGroupRoleTemplateOutput = new UserGroupRoleTemplateOutput();

  const mockedUserGroupRoleTemplateService = {
    getTemplateRoles: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupRoleTemplateController],
      providers: [
        ConfigService,
        {
          provide: UserGroupRoleTemplateService,
          useValue: { mockedUserGroupRoleTemplateService },
        },
        {
          provide: AppLogger,
          useValue: { setContext: jest.fn(), log: jest.fn() },
        },
        {
          provide: UserGroupRoleTemplateRepository,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserGroupRoleTemplateController>(
      UserGroupRoleTemplateController,
    );

    service = module.get<UserGroupRoleTemplateService>(
      UserGroupRoleTemplateService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTemplateRoles', () => {
    it('getTemplateRoles success', async () => {
      service.getTemplateRoles = jest
        .fn()
        .mockReturnValue([userGroupRoleTemplateOutput]);

      const result = await controller.getTemplateRoles(ctx);

      expect(result.data).toEqual([userGroupRoleTemplateOutput]);
      expect(result.meta).toEqual({});
    });

    it('should report an error when the getTemplateRoles service fails', async () => {
      service.getTemplateRoles = jest
        .fn()
        .mockRejectedValue({ message: 'Error test' });

      try {
        await controller.getTemplateRoles(ctx);
      } catch (error) {
        expect(error.message).toEqual('Error test');
      }
    });
  });
});
