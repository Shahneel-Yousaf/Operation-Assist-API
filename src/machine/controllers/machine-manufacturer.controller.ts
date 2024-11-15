import { MachineManufacturerOutput } from '@machine/dtos';
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
@Controller('machine-manufacturers')
export class MachineManufacturerController {
  constructor(
    private readonly machineService: MachineService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MachineManufacturerController.name);
  }

  @Get()
  @ApiOperation({ summary: 'List machine manufacturer api' })
  @ApiOkResponse({ type: SwaggerBaseApiResponse([MachineManufacturerOutput]) })
  async getListMachineManufacturer(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<MachineManufacturerOutput[]>> {
    this.logger.log(ctx, `${this.getListMachineManufacturer.name} was called`);

    const machineManufacturers =
      await this.machineService.getListMachineManufacturer(ctx);

    return { data: machineManufacturers, meta: {} };
  }
}
