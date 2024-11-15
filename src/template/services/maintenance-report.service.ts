import { Injectable } from '@nestjs/common';
import { MaintenanceReasonChoiceCode } from '@shared/constants';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ListMaintenanceReportTemplateOutput } from '@template/dtos';
import {
  IrregularMaintenanceItemChoiceRepository,
  MaintenanceReasonChoiceRepository,
  MaintenanceReasonPeriodChoiceRepository,
  RegularMaintenanceItemChoiceRepository,
} from '@template/repositories';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MaintenanceReportService {
  constructor(
    private readonly regularMaintenanceItemChoiceRepo: RegularMaintenanceItemChoiceRepository,
    private readonly irregularMaintenanceItemChoiceRepo: IrregularMaintenanceItemChoiceRepository,
    private readonly maintenanceReasonChoiceRepo: MaintenanceReasonChoiceRepository,
    private readonly maintenanceReasonPeriodChoiceRepo: MaintenanceReasonPeriodChoiceRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(MaintenanceReportService.name);
  }

  async getMaintenanceReportTemplate(
    ctx: RequestContext,
  ): Promise<ListMaintenanceReportTemplateOutput> {
    this.logger.log(
      ctx,
      `${this.getMaintenanceReportTemplate.name} was called`,
    );

    const isoLocaleCode = ctx.isoLocaleCode;

    const [
      regularMaintenanceItemChoiceTemplates,
      irregularMaintenanceItemChoiceTemplates,
      maintenanceReasonChoiceTemplates,
      maintenanceReasonPeriodChoiceTemplates,
    ] = await Promise.all([
      this.regularMaintenanceItemChoiceRepo.find({
        where: {
          regularMaintenanceItemChoiceTranslation: {
            isoLocaleCode,
          },
          isDisabled: false,
        },
        relations: ['regularMaintenanceItemChoiceTranslation'],
        order: { position: 'ASC' },
      }),
      this.irregularMaintenanceItemChoiceRepo.find({
        where: {
          irregularMaintenanceItemChoiceTranslation: {
            isoLocaleCode,
          },
          isDisabled: false,
        },
        relations: ['irregularMaintenanceItemChoiceTranslation'],
        order: { position: 'ASC' },
      }),
      this.maintenanceReasonChoiceRepo.find({
        where: {
          maintenanceReasonChoiceTranslation: {
            isoLocaleCode,
          },
        },
        relations: ['maintenanceReasonChoiceTranslation'],
        order: { position: 'ASC' },
      }),
      this.maintenanceReasonPeriodChoiceRepo.find({
        where: {
          maintenanceReasonPeriodChoiceTranslation: {
            isoLocaleCode,
          },
        },
        relations: ['maintenanceReasonPeriodChoiceTranslation'],
        order: { position: 'ASC' },
      }),
    ]);

    return plainToInstance(ListMaintenanceReportTemplateOutput, {
      regularMaintenanceItemChoiceTemplates:
        regularMaintenanceItemChoiceTemplates.map((item) => ({
          ...item,
          ...item.regularMaintenanceItemChoiceTranslation,
        })),
      irregularMaintenanceItemChoiceTemplates:
        irregularMaintenanceItemChoiceTemplates.map((item) => ({
          ...item,
          ...item.irregularMaintenanceItemChoiceTranslation,
        })),
      maintenanceReasonChoiceTemplates: maintenanceReasonChoiceTemplates.map(
        (item) => ({
          ...item,
          ...item.maintenanceReasonChoiceTranslation,
          isPeriodSelection:
            item.maintenanceReasonChoiceCode ===
            MaintenanceReasonChoiceCode.PERIOD_ELAPSE,
        }),
      ),
      maintenanceReasonPeriodChoiceTemplates:
        maintenanceReasonPeriodChoiceTemplates.map((item) => ({
          ...item,
          ...item.maintenanceReasonPeriodChoiceTranslation,
        })),
    });
  }
}
