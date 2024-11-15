import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { permissions } from '@shared/constants';
import { Permission } from '@shared/decorators';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { UserGroupRoleTemplateOutput } from '@user-group-role-template/dtos';
import { UserGroupRoleTemplateService } from '@user-group-role-template/services/user-group-role-template.service';

@ApiTags('group-role-templates')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('group-role-templates')
export class UserGroupRoleTemplateController {
  constructor(
    private readonly userGroupRoleTemplateService: UserGroupRoleTemplateService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserGroupRoleTemplateController.name);
  }

  @Get()
  @Permission(permissions.userGroupAssignment.read)
  @ApiOperation({
    summary: 'Get template list role and permissions for each role',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([UserGroupRoleTemplateOutput]),
  })
  async getTemplateRoles(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<UserGroupRoleTemplateOutput[]>> {
    this.logger.log(ctx, `${this.getTemplateRoles.name} was called`);

    const templateRoles =
      await this.userGroupRoleTemplateService.getTemplateRoles(
        ctx.isoLocaleCode,
      );

    return { data: templateRoles, meta: {} };
  }
}
