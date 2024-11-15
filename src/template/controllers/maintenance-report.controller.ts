import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ListMaintenanceReportTemplateOutput } from '@template/dtos';
import { MaintenanceReportService } from '@template/services/maintenance-report.service';

@ApiTags('templates')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('maintenance-report-templates')
export class MaintenanceReportController {
  constructor(
    private readonly maintenanceReportService: MaintenanceReportService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MaintenanceReportController.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get report maintenance template' })
  @ApiOkResponse({
    type: SwaggerBaseApiResponse(ListMaintenanceReportTemplateOutput),
  })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async getMaintenanceReportTemplate(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<ListMaintenanceReportTemplateOutput>> {
    this.logger.log(
      ctx,
      `${this.getMaintenanceReportTemplate.name} was called`,
    );
    const data =
      await this.maintenanceReportService.getMaintenanceReportTemplate(ctx);

    return { data, meta: {} };
  }
}
