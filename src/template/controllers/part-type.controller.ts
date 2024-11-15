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
import { ListPartTypeTemplateOutput } from '@template/dtos';
import { PartTypeService } from '@template/services/part-type.service';

@ApiTags('templates')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller('part-types')
export class PartTypeController {
  constructor(
    private readonly partTypeService: PartTypeService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(PartTypeController.name);
  }

  @Get()
  @ApiOperation({ summary: 'Get list part types' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([ListPartTypeTemplateOutput]) })
  @ApiBadRequestResponse({ type: BaseApiErrorResponse })
  async getListPartType(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<ListPartTypeTemplateOutput[]>> {
    this.logger.log(ctx, `${this.getListPartType.name} was called`);
    const data = await this.partTypeService.getListPartType(ctx);

    return { data, meta: {} };
  }
}
