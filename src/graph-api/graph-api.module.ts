import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';

import { GraphAPIService } from './services/graph-api.service';

@Module({
  imports: [SharedModule],
  providers: [GraphAPIService],
  exports: [GraphAPIService],
})
export class GraphApiModule {}
