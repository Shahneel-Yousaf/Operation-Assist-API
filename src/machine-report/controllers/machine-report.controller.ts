import {
  GetMachineReportsOutput,
  GroupMachineParam,
  GroupMachineReportParam,
  MachineHistoriesOutput,
  MachineReportInput,
  MachineReportOutput,
  MachineReportResponseInput,
  PaginationInputQuery,
} from '@group/dtos';
import { Group } from '@group/entities';
import {
  GetMachineReportDetailOutput,
  GetMachineReportResponsesOutput,
  MachineReportResponseOutput,
} from '@machine/dtos';
import {
  FuelMaintenanceReportInput,
  GetFuelMaintenanceReportDetailOutput,
  GetMachineOperationReportDetailOutput,
  GetMachineReportsForWebappOutput,
  GetMachineReportsForWebappQuery,
  GetMachineSummaryOutput,
  GetMachineSummaryQuery,
  GetMaintenanceReportDetailOutput,
  GetReportFilterCountOutput,
  GetReportFilterCountQuery,
  MachineOperationReportInput,
  MaintenanceReportInput,
  SyncMachineReportInput,
  SyncMachineReportOutput,
} from '@machine-report/dtos';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  defaultExamples,
  MiddlewareEnum,
  permissions,
  PLATFORM,
  Platform,
  platformOutput,
} from '@shared/constants';
import { GroupContext, Permission } from '@shared/decorators';
import { MiddlewareException } from '@shared/decorators/middlewares-exception.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { SyncValidateInterceptor } from '@shared/interceptors';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { I18nService } from 'nestjs-i18n';

import { MachineReportService } from '../services/machine-report.service';

@ApiTags('machine-reports')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('groups/:groupId/machines/:machineId')
export class MachineReportController {
  constructor(
    private readonly machineReportService: MachineReportService,
    private readonly logger: AppLogger,
    private readonly i18n: I18nService,
  ) {
    this.logger.setContext(MachineReportController.name);
  }

  @Permission(permissions.inspection.create)
  @Post('machine-reports')
  @ApiOperation({ summary: 'Create machine report' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(MachineReportOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createMachineReport(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: MachineReportInput,
    @GroupContext() groupContext: Group,
  ): Promise<BaseApiResponse<MachineReportOutput>> {
    this.logger.log(ctx, `${this.createMachineReport.name} was called`);

    const machineReport = await this.machineReportService.createMachineReport(
      ctx,
      params,
      input,
      groupContext,
    );

    return {
      data: machineReport,
      meta: {
        successMessage: this.i18n.t('message.machineReport.createSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Get('machine-reports')
  @ApiOperation({
    summary: 'Get list machine report',
  })
  @ApiExtraModels(
    SwaggerBaseApiResponse([GetMachineReportsOutput]),
    SwaggerBaseApiResponse([GetMachineReportsForWebappOutput]),
  )
  @ApiOkResponse(
    platformOutput(
      SwaggerBaseApiResponse([GetMachineReportsOutput]),
      SwaggerBaseApiResponse([GetMachineReportsForWebappOutput]),
    ),
  )
  @ApiHeader(defaultExamples.platform)
  async getListMachineReport(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Query() query: GetMachineReportsForWebappQuery,
    @Headers(PLATFORM) platform?: Platform,
  ): Promise<
    BaseApiResponse<
      GetMachineReportsOutput[] | GetMachineReportsForWebappOutput[]
    >
  > {
    this.logger.log(ctx, `${this.getListMachineReport.name} was called`);

    if (platform === Platform.WEBAPP) {
      if (query.limit > 100) {
        throw new BadRequestException(
          'The limit per page must be less than 100',
        );
      }

      return this.machineReportService.getListMachineReportForWebapp(
        ctx,
        params,
        query,
      );
    }

    return this.machineReportService.getListMachineReport(ctx, params, query);
  }

  @Permission(permissions.inspection.create)
  @Post('machine-reports/:machineReportId/machine-report-responses')
  @ApiOperation({ summary: 'Create machine report response' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createMachineReportResponse(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
    @Body() input: MachineReportResponseInput,
    @GroupContext() groupContext: Group,
  ): Promise<BaseApiResponse<MachineReportResponseOutput>> {
    this.logger.log(ctx, `${this.createMachineReportResponse.name} was called`);

    const reportResponse =
      await this.machineReportService.createMachineReportResponse(
        ctx,
        params,
        input,
        groupContext,
      );

    return {
      meta: {
        successMessage: this.i18n.t(
          'message.machineReportResponse.createSuccess',
          {
            lang: ctx.isoLocaleCode,
          },
        ),
      },
      data: reportResponse,
    };
  }

  @Put('machine-reports/:machineReportId/read-status')
  @ApiOperation({ summary: 'Update read mark for machine report' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateMachineReportReadStatus(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
  ) {
    this.logger.log(
      ctx,
      `${this.updateMachineReportReadStatus.name} was called`,
    );

    return this.machineReportService.updateMachineReportReadStatus(ctx, params);
  }

  @Get('machine-reports/:machineReportId/machine-report-responses')
  @ApiOperation({
    summary: 'Get machine report responses',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetMachineReportResponsesOutput),
  })
  async getMachineReportResponses(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
  ): Promise<BaseApiResponse<GetMachineReportResponsesOutput>> {
    this.logger.log(ctx, `${this.getMachineReportResponses.name} was called`);

    const data = await this.machineReportService.getMachineReportResponses(
      ctx,
      params,
    );

    return { data, meta: {} };
  }

  @Get('machine-histories')
  @ApiOperation({ summary: 'Get list machine history' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([MachineHistoriesOutput]),
  })
  async getMachineHistories(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Query() query: PaginationInputQuery,
  ): Promise<BaseApiResponse<MachineHistoriesOutput[]>> {
    this.logger.log(ctx, `${this.getMachineHistories.name} was called`);

    return this.machineReportService.getMachineHistories(ctx, params, query);
  }

  @Get('machine-reports/:machineReportId')
  @ApiOperation({
    summary: 'Get machine report detail',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetMachineReportDetailOutput),
  })
  async getMachineReportDetail(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
  ): Promise<BaseApiResponse<GetMachineReportDetailOutput>> {
    this.logger.log(ctx, `${this.getMachineReportDetail.name} was called`);
    const data = await this.machineReportService.getMachineReportDetail(
      ctx,
      params,
    );
    return { data, meta: {} };
  }

  @Post('sync-machine-report-data')
  @MiddlewareException([
    MiddlewareEnum.PATH_PARAMS_CHECK_INTERCEPTOR,
    MiddlewareEnum.PERMISSION_INTERCEPTOR,
  ])
  @ApiOperation({ summary: 'Sync machine report data' })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(SyncMachineReportOutput),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  @UseInterceptors(SyncValidateInterceptor)
  async createMachineReportOffline(
    @GroupContext() group: Group,
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: SyncMachineReportInput,
  ): Promise<BaseApiResponse<SyncMachineReportOutput>> {
    this.logger.log(ctx, `${this.createMachineReportOffline.name} was called`);

    const machineReport =
      await this.machineReportService.createMachineReportOffline(
        group,
        ctx,
        params,
        input,
      );

    return {
      data: machineReport,
      meta: {
        successMessage: this.i18n.t('message.machineReport.createSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Permission(permissions.inspection.create)
  @Post('machine-operation-reports')
  @ApiOperation({ summary: 'Create machine operation report' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(MachineReportOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createMachineOperationReport(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: MachineOperationReportInput,
  ): Promise<BaseApiResponse<MachineReportOutput>> {
    this.logger.log(
      ctx,
      `${this.createMachineOperationReport.name} was called`,
    );

    const data = await this.machineReportService.createMachineOperationReport(
      ctx,
      params,
      input,
    );

    return {
      data,
      meta: {
        successMessage: this.i18n.t(
          'message.machineOperationReport.createSuccess',
          {
            lang: ctx.isoLocaleCode,
          },
        ),
      },
    };
  }

  @Permission(permissions.inspection.create)
  @Post('fuel-maintenance-reports')
  @ApiOperation({ summary: 'Create fuel maintenance reports' })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(MachineReportOutput),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createFuelMaintenanceReport(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: FuelMaintenanceReportInput,
  ): Promise<BaseApiResponse<MachineReportOutput>> {
    this.logger.log(ctx, `${this.createFuelMaintenanceReport.name} was called`);

    if (
      !(
        input.fuelRefill ||
        input.oilCoolantRefillExchanges?.length ||
        input.partReplacements?.length
      )
    ) {
      throw new BadRequestException(
        'Must fill in at least 1 field out of 3 fields: fuelRefill, oilCoolantRefillExchanges, partReplacements',
      );
    }

    const machineReport =
      await this.machineReportService.createFuelMaintenanceReport(
        input,
        params,
        ctx,
      );

    return {
      data: machineReport,
      meta: {
        successMessage: this.i18n.t(
          'message.fuelMaintenanceReport.createSuccess',
          {
            lang: ctx.isoLocaleCode,
          },
        ),
      },
    };
  }

  @Get('machine-report-info')
  @ApiOperation({ summary: 'Get report filter count' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetReportFilterCountOutput),
  })
  async getReportFilterCount(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Query() query: GetReportFilterCountQuery,
    @GroupContext() groupContext: Group,
  ): Promise<BaseApiResponse<GetReportFilterCountOutput>> {
    this.logger.log(ctx, `${this.getReportFilterCount.name} was called`);
    const reportFilterCount =
      await this.machineReportService.getReportFilterCount(
        ctx,
        params,
        query,
        groupContext,
      );
    return { data: reportFilterCount, meta: {} };
  }

  @Get('machine-operation-reports/:machineReportId')
  @ApiOperation({
    summary: 'Get machine operation report detail',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetMachineOperationReportDetailOutput),
  })
  async getMachineOperationReportDetail(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
  ): Promise<BaseApiResponse<GetMachineOperationReportDetailOutput>> {
    this.logger.log(
      ctx,
      `${this.getMachineOperationReportDetail.name} was called`,
    );
    const data =
      await this.machineReportService.getMachineOperationReportDetail(
        ctx,
        params,
      );

    return { data, meta: {} };
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get machine summary' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([GetMachineSummaryOutput]),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async getMachineSummary(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Query() query: GetMachineSummaryQuery,
  ): Promise<BaseApiResponse<GetMachineSummaryOutput[]>> {
    this.logger.log(ctx, `${this.getMachineSummary.name} was called`);

    return this.machineReportService.getMachineSummary(ctx, params, query);
  }

  @Get('fuel-maintenance-reports/:machineReportId')
  @ApiOperation({
    summary: 'Get fuel maintenance report detail',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetFuelMaintenanceReportDetailOutput),
  })
  async getFuelMaintenanceReportDetail(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
  ): Promise<BaseApiResponse<GetFuelMaintenanceReportDetailOutput>> {
    this.logger.log(
      ctx,
      `${this.getFuelMaintenanceReportDetail.name} was called`,
    );

    const data = await this.machineReportService.getFuelMaintenanceReportDetail(
      ctx,
      params,
    );

    return { data, meta: {} };
  }

  @Permission(permissions.inspection.create)
  @Post('maintenance-reports')
  @ApiOperation({ summary: 'Create maintenance reports' })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(MachineReportOutput),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createMaintenanceReport(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: MaintenanceReportInput,
    @GroupContext() groupContext: Group,
  ): Promise<BaseApiResponse<MachineReportOutput>> {
    this.logger.log(ctx, `${this.createMaintenanceReport.name} was called`);

    const machineReport =
      await this.machineReportService.createMaintenanceReport(
        input,
        params,
        ctx,
        groupContext,
      );

    return {
      data: machineReport,
      meta: {
        successMessage: this.i18n.t('message.maintenanceReport.createSuccess', {
          lang: ctx.isoLocaleCode,
        }),
      },
    };
  }

  @Get('maintenance-reports/:machineReportId')
  @ApiOperation({
    summary: 'Get maintenance report detail',
  })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(GetMaintenanceReportDetailOutput),
  })
  async getMaintenanceReportDetail(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineReportParam,
  ): Promise<BaseApiResponse<GetMaintenanceReportDetailOutput>> {
    this.logger.log(ctx, `${this.getMaintenanceReportDetail.name} was called`);

    const data = await this.machineReportService.getMaintenanceReportDetail(
      ctx,
      params,
    );

    return { data, meta: {} };
  }
}
