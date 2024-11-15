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
import { ListOilTypeTemplateOutput } from '@template/dtos/list-oil-type-template-output.dto';
import { OilTypeService } from '@template/services/oil-type.service';

@ApiTags('templates')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('oil-types')
export class OilTypeController {
  constructor(
    private readonly oilTypeService: OilTypeService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(OilTypeController.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get list oil types' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([ListOilTypeTemplateOutput]) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async getListOilType(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<ListOilTypeTemplateOutput[]>> {
    this.logger.log(ctx, `${this.getListOilType.name} was called`);
    const data = await this.oilTypeService.getListOilType(ctx);

    return { data, meta: {} };
  }
}
