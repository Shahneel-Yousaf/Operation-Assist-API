import { Controller, Get } from '@nestjs/common';
import { MiddlewareEnum } from '@shared/constants';
import { MiddlewareException } from '@shared/decorators/middlewares-exception.decorator';

import { AppService } from './app.service';
import { AppLogger } from './shared/logger/logger.service';
import { ReqContext } from './shared/request-context/req-context.decorator';
import { RequestContext } from './shared/request-context/request-context.dto';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
  ) {
    this.logger.setContext(AppController.name);
  }

  @MiddlewareException([
    MiddlewareEnum.AUTH_GUARD,
    MiddlewareEnum.PERMISSION_INTERCEPTOR,
    MiddlewareEnum.RESPONSE_INTERCEPTOR,
  ])
  @Get('/health-check')
  healthCheck(@ReqContext() ctx: RequestContext): string {
    this.logger.log(ctx, '/health-check');

    return this.appService.healthCheck();
  }
}
