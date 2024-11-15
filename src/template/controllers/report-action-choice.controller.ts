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
import { ReportActionChoiceOutput } from '@template/dtos';
import { ReportActionChoiceService } from '@template/services/report-action-choice.service';

@ApiTags('report-action-choices')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('report-action-choices')
export class ReportActionChoiceController {
  constructor(
    private readonly reportActionChoiceService: ReportActionChoiceService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ReportActionChoiceController.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get machine report action choices' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([ReportActionChoiceOutput]) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async getMachineReportActionChoices(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<ReportActionChoiceOutput[]>> {
    this.logger.log(
      ctx,
      `${this.getMachineReportActionChoices.name} was called`,
    );
    const data =
      await this.reportActionChoiceService.getMachineReportActionChoices(ctx);
    return { data, meta: {} };
  }
}
