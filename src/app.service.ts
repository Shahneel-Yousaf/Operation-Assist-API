import { Injectable } from '@nestjs/common';

import { AppLogger } from './shared/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AppService.name);
  }

  healthCheck(): string {
    return 'Health check ok!';
  }
}
