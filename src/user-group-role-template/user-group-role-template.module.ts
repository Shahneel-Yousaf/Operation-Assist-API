import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';

import { UserGroupRoleTemplateController } from './controllers/user-group-role-template.controller';
import { UserGroupRoleTemplate } from './entities/user-group-role-template.entity';
import { UserGroupRoleTemplateRepository } from './repositories/user-group-role-template.repository';
import { UserGroupRoleTemplateService } from './services/user-group-role-template.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserGroupRoleTemplate])],
  providers: [UserGroupRoleTemplateService, UserGroupRoleTemplateRepository],
  controllers: [UserGroupRoleTemplateController],
  exports: [UserGroupRoleTemplateService],
})
export class UserGroupRoleTemplateModule {}
