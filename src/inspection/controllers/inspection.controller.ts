import { GroupMachineParam } from '@group/dtos';
import { Group } from '@group/entities';
import {
  CreateInspectionFormInput,
  CreateInspectionFormOutput,
  CreateInspectionInput,
  GetInspectionQuery,
  GetInspectionsForWebappOutput,
  GroupMachineInspectionFormParam,
  GroupMachineInspectionItemTemplateParam,
  GroupMachineInspectionParam,
  InspectionDetailOutput,
  InspectionFormOutput,
  InspectionFormParam,
  InspectionParam,
  ListInspectionFormsOutput,
  ListInspectionFormTemplateOutput,
  ListInspectionOutput,
  ListUserInspectionDraftsOutput,
  ListUserInspectionFormDraftsOutput,
  SyncInspectionDataInput,
  SyncInspectionDataOutput,
  UpdateInspectionFormInput,
  UpdateInspectionInput,
} from '@inspection/dtos';
import { InspectionService } from '@inspection/services/inspection.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  ParamEnum,
  permissions,
  PLATFORM,
  Platform,
  platformOutput,
} from '@shared/constants';
import { GroupContext, ParamException, Permission } from '@shared/decorators';
import { MiddlewareException } from '@shared/decorators/middlewares-exception.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
  SyncApiErrorResponse,
} from '@shared/dtos';
import { SyncValidateInterceptor } from '@shared/interceptors';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';

@ApiTags('inspections')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('groups/:groupId/machines/:machineId')
export class InspectionController {
  constructor(
    private readonly inspectionService: InspectionService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(InspectionController.name);
  }

  @Get('inspection-forms')
  @ApiOperation({ summary: 'Get list inspection sheet (form)' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([ListInspectionFormsOutput]) })
  async getListInspectionForm(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
  ): Promise<BaseApiResponse<ListInspectionFormsOutput[]>> {
    this.logger.log(ctx, `${this.getListInspectionForm.name} was called`);

    const data = await this.inspectionService.getListInspectionForm(
      ctx,
      params,
    );

    return { data, meta: {} };
  }

  @Get('user-inspection-form-drafts')
  @ApiOperation({ summary: 'Get list user inspection form draft' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([ListUserInspectionFormDraftsOutput]),
  })
  async getListUserInspectionFormDraft(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
  ): Promise<BaseApiResponse<ListUserInspectionFormDraftsOutput[]>> {
    this.logger.log(
      ctx,
      `${this.getListUserInspectionFormDraft.name} was called`,
    );

    const data = await this.inspectionService.getListUserInspectionFormDraft(
      ctx,
      params,
    );

    return { data, meta: {} };
  }

  @Get('user-inspection-drafts')
  @ApiOperation({ summary: 'Get list user inspection draft' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([ListUserInspectionDraftsOutput]),
  })
  async getListUserInspectionDraft(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
  ): Promise<BaseApiResponse<ListUserInspectionDraftsOutput[]>> {
    this.logger.log(ctx, `${this.getListUserInspectionDraft.name} was called`);
    const data = await this.inspectionService.getListUserInspectionDraft(
      ctx,
      params,
    );

    return { data, meta: {} };
  }

  @Delete('inspection-forms/:customInspectionFormId')
  @Permission(permissions.customInspectionForm.update)
  @ApiOperation({ summary: 'Delete inspection form' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  async deleteInspectionForm(
    @ReqContext() ctx: RequestContext,
    @Param() params: InspectionFormParam,
  ) {
    this.logger.log(ctx, `${this.deleteInspectionForm.name} was called`);

    return this.inspectionService.deleteInspectionForm(ctx, params);
  }

  @Get('inspection-form-templates')
  @ApiOperation({ summary: 'Get list templates, created inspection form' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(ListInspectionFormTemplateOutput),
  })
  async getListInspectionFormTemplate(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @GroupContext() group: Group,
  ): Promise<BaseApiResponse<ListInspectionFormTemplateOutput>> {
    this.logger.log(
      ctx,
      `${this.getListInspectionFormTemplate.name} was called`,
    );

    const data =
      await this.inspectionService.getListTemplateAndCreatedInspectionForm(
        ctx,
        params,
        group.machines[0].machineTypeId,
      );
    return { data, meta: {} };
  }

  @Get('inspection-form-templates/:inspectionFormTemplateId')
  @ApiOperation({ summary: 'Get list inspection item templates' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(InspectionFormOutput),
  })
  async getListInspectionItemTemplate(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineInspectionItemTemplateParam,
  ): Promise<BaseApiResponse<InspectionFormOutput>> {
    this.logger.log(
      ctx,
      `${this.getListInspectionItemTemplate.name} was called`,
    );
    const data = await this.inspectionService.getInspectionItemTemplates(
      ctx,
      params,
    );
    return { data, meta: {} };
  }

  @ParamException([ParamEnum.CUSTOM_INSPECTION_FORM_ID])
  @Get('inspection-forms/:customInspectionFormId')
  @ApiOperation({ summary: 'Get list inspection items' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(InspectionFormOutput),
  })
  async getListInspectionItem(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineInspectionFormParam,
  ): Promise<BaseApiResponse<InspectionFormOutput>> {
    this.logger.log(ctx, `${this.getListInspectionItem.name} was called`);

    const data = await this.inspectionService.getInspectionItems(ctx, params);
    return { data, meta: {} };
  }

  @Permission(permissions.customInspectionForm.create)
  @Post('inspection-forms')
  @ApiOperation({ summary: 'Create draft | public inspection form' })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(CreateInspectionFormOutput),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createInspectionForm(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() body: CreateInspectionFormInput,
  ): Promise<BaseApiResponse<CreateInspectionFormOutput>> {
    this.logger.log(ctx, `${this.createInspectionForm.name} was called`);

    return this.inspectionService.createInspectionForm(ctx, params, body);
  }

  @Permission(permissions.customInspectionForm.update)
  @Put('inspection-forms/:customInspectionFormId')
  @ApiOperation({ summary: 'Update draft -> draft | public inspection form' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(CreateInspectionFormOutput) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateInspectionForm(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineInspectionFormParam,
    @Body() body: UpdateInspectionFormInput,
    @GroupContext() group: Group,
  ): Promise<BaseApiResponse<CreateInspectionFormOutput>> {
    this.logger.log(ctx, `${this.updateInspectionForm.name} was called`);

    return this.inspectionService.updateInspectionForm(
      ctx,
      params,
      body,
      group.machines[0].customInspectionForms[0],
    );
  }

  @Permission(permissions.inspection.create)
  @Post('inspections')
  @ApiOperation({ summary: 'Create inspection (draft/posted)' })
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async createInspection(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: CreateInspectionInput,
    @GroupContext() group: Group,
  ) {
    this.logger.log(ctx, `${this.createInspection.name} was called`);

    return this.inspectionService.createInspection(ctx, params, input, group);
  }

  @Get('inspections/:inspectionId')
  @ApiOperation({ summary: 'Get inspection detail' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(InspectionDetailOutput),
  })
  async getInspectionDetail(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineInspectionParam,
  ): Promise<BaseApiResponse<InspectionDetailOutput>> {
    this.logger.log(ctx, `${this.getInspectionDetail.name} was called`);

    const data = await this.inspectionService.getInspectionDetail(ctx, params);

    return { data, meta: {} };
  }

  @Permission(permissions.inspection.create)
  @Put('inspections/:inspectionId')
  @ApiOperation({ summary: 'Update inspection (draft/posted)' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse({}) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  @ApiForbiddenResponse({ type: BaseApiErrorResponse })
  async updateInspection(
    @ReqContext() ctx: RequestContext,
    @Param() params: InspectionParam,
    @Body() input: UpdateInspectionInput,
    @GroupContext() group: Group,
  ) {
    this.logger.log(ctx, `${this.updateInspection.name} was called`);

    return this.inspectionService.updateInspection(ctx, params, input, group);
  }

  @Get('inspections')
  @ApiExtraModels(
    SwaggerBaseApiResponse([ListInspectionOutput]),
    SwaggerBaseApiResponse([GetInspectionsForWebappOutput]),
  )
  @ApiOkResponse(
    platformOutput(
      SwaggerBaseApiResponse([ListInspectionOutput]),
      SwaggerBaseApiResponse([GetInspectionsForWebappOutput]),
    ),
  )
  @ApiHeader(defaultExamples.platform)
  @ApiOperation({ summary: 'Get list inspections (posted)' })
  async getListInspection(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Query() query: GetInspectionQuery,
    @Headers(PLATFORM) platform?: Platform,
  ): Promise<
    BaseApiResponse<ListInspectionOutput[] | GetInspectionsForWebappOutput>
  > {
    this.logger.log(ctx, `${this.getListInspection.name} was called`);

    if (platform === Platform.WEBAPP) {
      if (!query.monthYear || !query.customInspectionFormId) {
        throw new BadRequestException(
          'In webapp platform monthYear and customInspectionFormId are required',
        );
      }

      return this.inspectionService.getInspectionsForWebapp(ctx, params, query);
    }

    return this.inspectionService.getListInspection(ctx, params, query);
  }

  @Get('inspection-pdf')
  @ApiOperation({ summary: 'Generate inspection pdf' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse([]),
  })
  async generateInspectionPdf(
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Query() query: GetInspectionQuery,
  ) {
    this.logger.log(ctx, `${this.generateInspectionPdf.name} was called`);

    if (!query.monthYear || !query.customInspectionFormId) {
      throw new BadRequestException(
        'monthYear and customInspectionFormId are required',
      );
    }

    const data = await this.inspectionService.generateInspectionPdf(
      ctx,
      params,
      query,
    );

    // Send the file
    return { data, meta: {} };
  }

  @Post('sync-inspection-data')
  @ApiOperation({
    summary: 'sync-inspection-data (Create inspection (draft/posted))',
  })
  @ApiCreatedResponse({
    type: SwaggerBaseApiResponse(SyncInspectionDataOutput),
  })
  @ApiBadRequestResponse({ type: SyncApiErrorResponse })
  @ApiForbiddenResponse({ type: SyncApiErrorResponse })
  @MiddlewareException([
    MiddlewareEnum.PATH_PARAMS_CHECK_INTERCEPTOR,
    MiddlewareEnum.PERMISSION_INTERCEPTOR,
  ])
  @UseInterceptors(SyncValidateInterceptor)
  async syncInspectionData(
    @GroupContext() group: Group,
    @ReqContext() ctx: RequestContext,
    @Param() params: GroupMachineParam,
    @Body() input: SyncInspectionDataInput,
  ): Promise<BaseApiResponse<SyncInspectionDataOutput>> {
    this.logger.log(ctx, `${this.syncInspectionData.name} was called`);

    return this.inspectionService.syncInspectionData(group, ctx, params, input);
  }
}
