import { GroupQuery } from '@group/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MiddlewareEnum } from '@shared/constants';
import { MiddlewareException } from '@shared/decorators/middlewares-exception.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  CommonRequest,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';
import {
  GetUserSettingOutput,
  RegisterUserInput,
  UpdateUserDeviceInput,
  UpdateUserDeviceOutput,
  UpdateUserProfileInput,
  UpdateUserSettingInput,
  UpdateUserSettingOutput,
  UserOutput,
  UserPermissionsOutput,
} from '@user/dtos';
import { UserService } from '@user/services/user.service';

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Get('me')
  @MiddlewareException([MiddlewareEnum.PERMISSION_INTERCEPTOR])
  @ApiOperation({ summary: 'Get user profile API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UserOutput) })
  async getMyProfile(
    @ReqContext() ctx: RequestContext,
    @Req() req: CommonRequest,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.getMyProfile.name} was called`);

    const user = await this.userService.getMyProfile(ctx, req);

    return { data: user, meta: {} };
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get user permissions API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UserPermissionsOutput) })
  async getUserPermissions(
    @ReqContext() ctx: RequestContext,
    @Query() query: GroupQuery,
  ): Promise<BaseApiResponse<UserPermissionsOutput>> {
    this.logger.log(ctx, `${this.getUserPermissions.name} was called`);

    const userPermissions = await this.userService.getUserPermissions(
      ctx,
      query,
    );

    return { data: userPermissions, meta: {} };
  }

  @Post()
  @MiddlewareException([MiddlewareEnum.PERMISSION_INTERCEPTOR])
  @ApiOperation({ summary: 'Register user API' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(UserOutput) })
  async registerUser(
    @Headers('x-lang') language: string,
    @ReqContext() ctx: RequestContext,
    @Body() registerUserInput: RegisterUserInput,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.registerUser.name} was called`);

    const user = await this.userService.registerUser(
      ctx,
      registerUserInput,
      language,
    );

    return { data: user, meta: {} };
  }

  @Put('me')
  @ApiOperation({ summary: 'Update user profile API' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UserOutput) })
  async updateMyProfile(
    @ReqContext() ctx: RequestContext,
    @Body() updateUserProfileInput: UpdateUserProfileInput,
  ): Promise<BaseApiResponse<UserOutput>> {
    this.logger.log(ctx, `${this.updateMyProfile.name} was called`);

    const user = await this.userService.updateUserProfile(
      ctx,
      updateUserProfileInput,
    );

    return { data: user, meta: {} };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get user setting' })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(GetUserSettingOutput) })
  async getUserSetting(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<GetUserSettingOutput>> {
    this.logger.log(ctx, `${this.getUserSetting.name} was called`);
    const userSetting = await this.userService.getUserSetting(ctx);

    return { data: userSetting, meta: {} };
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update user setting' })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UpdateUserSettingOutput) })
  async updateUserSetting(
    @ReqContext() ctx: RequestContext,
    @Body() updateUserSettingInput: UpdateUserSettingInput,
  ): Promise<BaseApiResponse<UpdateUserSettingOutput>> {
    this.logger.log(ctx, `${this.updateUserSetting.name} was called`);

    const userSetting = await this.userService.updateUserSetting(
      ctx,
      updateUserSettingInput,
    );

    return { data: userSetting, meta: {} };
  }

  @Put('devices')
  @ApiOperation({ summary: 'Update user device (update fcm token)' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(UpdateUserDeviceOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async updateUserDevice(
    @ReqContext() ctx: RequestContext,
    @Body() input: UpdateUserDeviceInput,
  ): Promise<BaseApiResponse<UpdateUserDeviceOutput>> {
    this.logger.log(ctx, `${this.updateUserDevice.name} was called`);

    const userDevice = await this.userService.updateUserDevice(ctx, input);

    return { data: userDevice, meta: {} };
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async deleteUser(@ReqContext() ctx: RequestContext) {
    this.logger.log(ctx, `${this.deleteUser.name} was called`);

    return this.userService.deleteUser(ctx);
  }
}
