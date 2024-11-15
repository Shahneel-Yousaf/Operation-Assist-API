import { MachineRelatedInfoOutput, MachineTypeOutput } from '@machine/dtos';
import { MachineService } from '@machine/services/machine.service';
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
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '@shared/dtos';
import { AppLogger } from '@shared/logger/logger.service';
import { ReqContext } from '@shared/request-context/req-context.decorator';
import { RequestContext } from '@shared/request-context/request-context.dto';

@ApiTags('machines')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: BaseApiErrorResponse })
@ApiNotFoundResponse({ type: BaseApiErrorResponse })
@ApiInternalServerErrorResponse({ type: BaseApiErrorResponse })
@Controller()
export class MachineTypeController {
  constructor(
    private readonly machineService: MachineService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MachineTypeController.name);
  }

  @Get('machine-types')
  @ApiOperation({ summary: 'List machine type api' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([MachineTypeOutput]) })
  async getListMachineType(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<MachineTypeOutput[]>> {
    this.logger.log(ctx, `${this.getListMachineType.name} was called`);

    const machineTypes = await this.machineService.getListMachineType(ctx);

    return { data: machineTypes, meta: {} };
  }

  @Get('machine-related-info')
  @ApiOperation({
    summary:
      'List machine manufacturers, machine types and return validation for serial number',
  })
  @ApiOkResponse({ type: SwaggerBaseApiResponse(MachineRelatedInfoOutput) })
  async getMachineRelatedInfo(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<MachineRelatedInfoOutput>> {
    this.logger.log(ctx, `${this.getMachineRelatedInfo.name} was called`);

    const response = await this.machineService.getMachineRelatedInfo(ctx);

    return { data: response, meta: {} };
  }
}
