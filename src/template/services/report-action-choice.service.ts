import { Injectable } from '@nestjs/common';
import { AppLogger } from '@shared/logger/logger.service';
import { RequestContext } from '@shared/request-context/request-context.dto';
import { ReportActionChoiceOutput } from '@template/dtos';
import { ReportActionChoiceRepository } from '@template/repositories';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReportActionChoiceService {
  constructor(
    private readonly repository: ReportActionChoiceRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ReportActionChoiceService.name);
  }

  async getMachineReportActionChoices(
    ctx: RequestContext,
  ): Promise<ReportActionChoiceOutput[]> {
    const isoLocaleCode = ctx.isoLocaleCode;

    const reportActionChoices = await this.repository.find({
      where: {
        reportActionChoiceTranslation: {
          isoLocaleCode,
        },
      },
      relations: ['reportActionChoiceTranslation'],
      order: {
        reportActionChoiceCode: 'DESC',
      },
    });

    return plainToInstance(
      ReportActionChoiceOutput,
      reportActionChoices.map((reportActionChoice) => ({
        ...reportActionChoice,
        isoLocaleCode,
        reportActionChoiceName:
          reportActionChoice.reportActionChoiceTranslation
            .reportActionChoiceName,
      })),
    );
  }
}
