import {
  GroupMachineParam,
  MachineHistoriesOutput,
  PaginationInputQuery,
} from '@group/dtos';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Version } from '@shared/constants';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';

import { MachineReportService } from '../services/machine-report.service';

@ApiTags('machine-reports')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller({
  path: 'groups/:groupId/machines/:machineId',
  version: Version.V1,
})
export class MachineReportControllerV1 {
  constructor(
    private readonly machineReportService: MachineReportService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MachineReportControllerV1.name);
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

    return this.machineReportService.getMachineHistories(
      ctx,
      params,
      query,
      Version.V1,
    );
  }
}
